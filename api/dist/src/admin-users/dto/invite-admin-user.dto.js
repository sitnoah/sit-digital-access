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
exports.InviteAdminUserDto = exports.WORKFORCE_ROLES = void 0;
const class_validator_1 = require("class-validator");
exports.WORKFORCE_ROLES = [
    "superAdmin",
    "admin",
    "operationsManager",
    "deviceManager",
    "donationsManager",
    "supportAgent",
    "deploymentCoordinator",
    "countryManager",
    "inventoryManager",
    "analyticsManager"
];
class InviteAdminUserDto {
    fullName;
    email;
    role;
    team;
    country;
    deploymentRegion;
    permissionsPreset;
    deploymentRegions;
}
exports.InviteAdminUserDto = InviteAdminUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], InviteAdminUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteAdminUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.WORKFORCE_ROLES),
    __metadata("design:type", String)
], InviteAdminUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], InviteAdminUserDto.prototype, "team", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], InviteAdminUserDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], InviteAdminUserDto.prototype, "deploymentRegion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], InviteAdminUserDto.prototype, "permissionsPreset", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(12),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], InviteAdminUserDto.prototype, "deploymentRegions", void 0);
//# sourceMappingURL=invite-admin-user.dto.js.map