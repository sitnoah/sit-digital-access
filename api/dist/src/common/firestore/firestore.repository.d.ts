import { CollectionReference, DocumentData, Firestore } from "firebase-admin/firestore";
export declare class FirestoreRepository {
    private readonly db;
    constructor(db: Firestore);
    collection(name: string): CollectionReference<DocumentData>;
    create<T extends Record<string, unknown>>(collectionName: string, data: T): Promise<T & {
        id: string;
    }>;
    list<T>(collectionName: string, limit?: number): Promise<T[]>;
    findById<T>(collectionName: string, id: string): Promise<T>;
    update<T>(collectionName: string, id: string, data: Record<string, unknown>): Promise<T>;
    delete(collectionName: string, id: string): Promise<void>;
    getSingleton<T>(collectionName: string, id: string, defaults: T): Promise<T>;
    setSingleton<T>(collectionName: string, id: string, data: Record<string, unknown>): Promise<T>;
}
