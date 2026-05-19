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
exports.AdminCreateDeviceRequestDto = void 0;
const class_validator_1 = require("class-validator");
const device_request_enums_1 = require("../device-request.enums");
const create_device_request_dto_1 = require("./create-device-request.dto");
class AdminCreateDeviceRequestDto extends create_device_request_dto_1.CreateDeviceRequestDto {
    priority;
    assignedOwner;
    internalNotes;
    fulfilmentPlan;
    deploymentType;
    metadata;
}
exports.AdminCreateDeviceRequestDto = AdminCreateDeviceRequestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(device_request_enums_1.DeviceRequestPriority),
    __metadata("design:type", String)
], AdminCreateDeviceRequestDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], AdminCreateDeviceRequestDto.prototype, "assignedOwner", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 3000),
    __metadata("design:type", String)
], AdminCreateDeviceRequestDto.prototype, "internalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 3000),
    __metadata("design:type", String)
], AdminCreateDeviceRequestDto.prototype, "fulfilmentPlan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], AdminCreateDeviceRequestDto.prototype, "deploymentType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AdminCreateDeviceRequestDto.prototype, "metadata", void 0);
//# sourceMappingURL=admin-create-device-request.dto.js.map