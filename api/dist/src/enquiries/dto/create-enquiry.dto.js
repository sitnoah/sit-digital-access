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
exports.CreateEnquiryDto = void 0;
const class_validator_1 = require("class-validator");
const enquiry_enums_1 = require("../enquiry.enums");
class CreateEnquiryDto {
    fullName;
    organisation;
    email;
    phone;
    country;
    enquiryType;
    message;
    priority;
    organisationType;
    deploymentScale;
    estimatedLearnerCount;
    powerAvailability;
    connectivityProfile;
    timeline;
    deviceQuantity;
    preferredDeviceCategory;
    preferredPackage;
    classroomCount;
    powerConnectivityNotes;
    programmeSlug;
    serviceSlug;
    learnerCount;
    deploymentRegion;
    trainingRequirement;
    deviceRequirement;
    deviceCategories;
    supportModelRequired;
    deploymentLocation;
}
exports.CreateEnquiryDto = CreateEnquiryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 160),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "organisation", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 40),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enquiry_enums_1.EnquiryType),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "enquiryType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 2000),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enquiry_enums_1.EnquiryPriority),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "organisationType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "deploymentScale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateEnquiryDto.prototype, "estimatedLearnerCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "powerAvailability", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "connectivityProfile", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "timeline", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateEnquiryDto.prototype, "deviceQuantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 120),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "preferredDeviceCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 140),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "preferredPackage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateEnquiryDto.prototype, "classroomCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 260),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "powerConnectivityNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 140),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "programmeSlug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 140),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "serviceSlug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateEnquiryDto.prototype, "learnerCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 140),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "deploymentRegion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 180),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "trainingRequirement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 180),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "deviceRequirement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(12),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateEnquiryDto.prototype, "deviceCategories", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 160),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "supportModelRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 180),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "deploymentLocation", void 0);
//# sourceMappingURL=create-enquiry.dto.js.map