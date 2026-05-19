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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInventoryItemDto = void 0;
const class_validator_1 = require("class-validator");
const inventory_enums_1 = require("../inventory.enums");
class CreateInventoryItemDto {
    assetTag;
    deviceType;
    brand;
    model;
    processor;
    ram;
    storage;
    conditionGrade;
    status;
    location;
    assignedTo;
    costPrice;
    suggestedPrice;
    warrantyMonths;
    africaReady;
    lowPowerSuitable;
    labBundleReady;
    notes;
    lifecycle;
    supportHistory;
    metadata;
}
exports.CreateInventoryItemDto = CreateInventoryItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 80),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "assetTag", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 80),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "deviceType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 80),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "brand", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 120),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "processor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 80),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "ram", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 80),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "storage", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(inventory_enums_1.ConditionGrade),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "conditionGrade", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(inventory_enums_1.InventoryStatus),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 160),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "assignedTo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "costPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "suggestedPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "warrantyMonths", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInventoryItemDto.prototype, "africaReady", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInventoryItemDto.prototype, "lowPowerSuitable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInventoryItemDto.prototype, "labBundleReady", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 2000),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateInventoryItemDto.prototype, "lifecycle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateInventoryItemDto.prototype, "supportHistory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateInventoryItemDto.prototype, "metadata", void 0);
//# sourceMappingURL=create-inventory-item.dto.js.map