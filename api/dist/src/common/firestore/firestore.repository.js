"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreRepository = void 0;
const common_1 = require("@nestjs/common");
const firestore_1 = require("firebase-admin/firestore");
const constants_1 = require("../constants");
function serialiseValue(value) {
    if (value instanceof firestore_1.Timestamp) {
        return value.toDate().toISOString();
    }
    if (Array.isArray(value)) {
        return value.map(serialiseValue);
    }
    if (typeof value === "object" && value !== null) {
        return Object.entries(value).reduce((acc, [key, nestedValue]) => {
            acc[key] = serialiseValue(nestedValue);
            return acc;
        }, {});
    }
    return value;
}
function serialiseDocument(id, data) {
    return serialiseValue({ id, ...data });
}
let FirestoreRepository = class FirestoreRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    collection(name) {
        return this.db.collection(name);
    }
    async create(collectionName, data) {
        const ref = this.collection(collectionName).doc();
        await ref.set({
            ...data,
            id: ref.id,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
        return this.findById(collectionName, ref.id);
    }
    async list(collectionName, limit = 100) {
        const snapshot = await this.collection(collectionName)
            .orderBy("createdAt", "desc")
            .limit(limit)
            .get();
        return snapshot.docs.map((doc) => serialiseDocument(doc.id, doc.data()));
    }
    async findById(collectionName, id) {
        const doc = await this.collection(collectionName).doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`${collectionName} record ${id} was not found`);
        }
        return serialiseDocument(doc.id, doc.data() ?? {});
    }
    async update(collectionName, id, data) {
        const ref = this.collection(collectionName).doc(id);
        const before = await ref.get();
        if (!before.exists) {
            throw new common_1.NotFoundException(`${collectionName} record ${id} was not found`);
        }
        await ref.update({
            ...data,
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        });
        return this.findById(collectionName, id);
    }
    async delete(collectionName, id) {
        const ref = this.collection(collectionName).doc(id);
        const before = await ref.get();
        if (!before.exists) {
            throw new common_1.NotFoundException(`${collectionName} record ${id} was not found`);
        }
        await ref.delete();
    }
    async getSingleton(collectionName, id, defaults) {
        const doc = await this.collection(collectionName).doc(id).get();
        if (!doc.exists) {
            return defaults;
        }
        return serialiseDocument(doc.id, doc.data() ?? {});
    }
    async setSingleton(collectionName, id, data) {
        const ref = this.collection(collectionName).doc(id);
        const before = await ref.get();
        await ref
            .set({
            ...data,
            ...(!before.exists ? { createdAt: firestore_1.FieldValue.serverTimestamp() } : {}),
            updatedAt: firestore_1.FieldValue.serverTimestamp()
        }, { merge: true });
        return this.findById(collectionName, id);
    }
};
exports.FirestoreRepository = FirestoreRepository;
exports.FirestoreRepository = FirestoreRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.FIRESTORE)),
    __metadata("design:paramtypes", [firestore_1.Firestore])
], FirestoreRepository);
//# sourceMappingURL=firestore.repository.js.map