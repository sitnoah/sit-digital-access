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
exports.CreateDeviceRequestDto = void 0;
const class_validator_1 = require("class-validator");
const device_request_enums_1 = require("../device-request.enums");
class CreateDeviceRequestDto {
    requesterName;
    organisation;
    email;
    phone;
    country;
    deviceCategory;
    productSlug;
    quantity;
    budgetRange;
    intendedUse;
    deploymentLocation;
    requiredBy;
    notes;
}
exports.CreateDeviceRequestDto = CreateDeviceRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "requesterName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 160),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "organisation", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 40),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(device_request_enums_1.DeviceCategory),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "deviceCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "productSlug", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], CreateDeviceRequestDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "budgetRange", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 1200),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "intendedUse", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 160),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "deploymentLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "requiredBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 2000),
    __metadata("design:type", String)
], CreateDeviceRequestDto.prototype, "notes", void 0);
//# sourceMappingURL=create-device-request.dto.js.map