import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  CollectionReference,
  DocumentData,
  FieldValue,
  Firestore,
  Timestamp
} from "firebase-admin/firestore";
import { FIRESTORE } from "../constants";

function serialiseValue(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serialiseValue);
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).reduce<Record<string, unknown>>((acc, [key, nestedValue]) => {
      acc[key] = serialiseValue(nestedValue);
      return acc;
    }, {});
  }

  return value;
}

function serialiseDocument<T>(id: string, data: DocumentData): T {
  return serialiseValue({ id, ...data }) as T;
}

@Injectable()
export class FirestoreRepository {
  constructor(@Inject(FIRESTORE) private readonly db: Firestore) {}

  collection(name: string): CollectionReference<DocumentData> {
    return this.db.collection(name);
  }

  async create<T extends Record<string, unknown>>(
    collectionName: string,
    data: T
  ): Promise<T & { id: string }> {
    const ref = this.collection(collectionName).doc();
    await ref.set({
      ...data,
      id: ref.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    return this.findById<T & { id: string }>(collectionName, ref.id);
  }

  async list<T>(collectionName: string, limit = 100): Promise<T[]> {
    const snapshot = await this.collection(collectionName)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => serialiseDocument<T>(doc.id, doc.data()));
  }

  async findById<T>(collectionName: string, id: string): Promise<T> {
    const doc = await this.collection(collectionName).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`${collectionName} record ${id} was not found`);
    }

    return serialiseDocument<T>(doc.id, doc.data() ?? {});
  }

  async update<T>(
    collectionName: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const ref = this.collection(collectionName).doc(id);
    const before = await ref.get();

    if (!before.exists) {
      throw new NotFoundException(`${collectionName} record ${id} was not found`);
    }

    await ref.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    });

    return this.findById<T>(collectionName, id);
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const ref = this.collection(collectionName).doc(id);
    const before = await ref.get();

    if (!before.exists) {
      throw new NotFoundException(`${collectionName} record ${id} was not found`);
    }

    await ref.delete();
  }

  async getSingleton<T>(collectionName: string, id: string, defaults: T): Promise<T> {
    const doc = await this.collection(collectionName).doc(id).get();

    if (!doc.exists) {
      return defaults;
    }

    return serialiseDocument<T>(doc.id, doc.data() ?? {});
  }

  async setSingleton<T>(
    collectionName: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const ref = this.collection(collectionName).doc(id);
    const before = await ref.get();

    await ref
      .set(
        {
          ...data,
          ...(!before.exists ? { createdAt: FieldValue.serverTimestamp() } : {}),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );

    return this.findById<T>(collectionName, id);
  }
}
