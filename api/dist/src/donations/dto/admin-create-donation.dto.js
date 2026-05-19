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
exports.AdminCreateDonationDto = void 0;
const class_validator_1 = require("class-validator");
const donation_enums_1 = require("../donation.enums");
const create_donation_dto_1 = require("./create-donation.dto");
class AdminCreateDonationDto extends create_donation_dto_1.CreateDonationDto {
    priority;
    assignedOwner;
    internalNotes;
    collectionPlan;
    sponsorshipPlan;
    metadata;
}
exports.AdminCreateDonationDto = AdminCreateDonationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(donation_enums_1.DonationPriority),
    __metadata("design:type", String)
], AdminCreateDonationDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 160),
    __metadata("design:type", String)
], AdminCreateDonationDto.prototype, "assignedOwner", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 4000),
    __metadata("design:type", String)
], AdminCreateDonationDto.prototype, "internalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 4000),
    __metadata("design:type", String)
], AdminCreateDonationDto.prototype, "collectionPlan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 4000),
    __metadata("design:type", String)
], AdminCreateDonationDto.prototype, "sponsorshipPlan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AdminCreateDonationDto.prototype, "metadata", void 0);
//# sourceMappingURL=admin-create-donation.dto.js.map