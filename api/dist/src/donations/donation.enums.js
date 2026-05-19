"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationPriority = exports.DonationStatus = exports.DonationType = exports.DonorType = void 0;
var DonorType;
(function (DonorType) {
    DonorType["INDIVIDUAL"] = "INDIVIDUAL";
    DonorType["COMPANY"] = "COMPANY";
    DonorType["NGO"] = "NGO";
    DonorType["SCHOOL"] = "SCHOOL";
    DonorType["FOUNDATION"] = "FOUNDATION";
    DonorType["GOVERNMENT"] = "GOVERNMENT";
})(DonorType || (exports.DonorType = DonorType = {}));
var DonationType;
(function (DonationType) {
    DonationType["USED_LAPTOPS"] = "USED_LAPTOPS";
    DonationType["DESKTOPS"] = "DESKTOPS";
    DonationType["MINI_PCS"] = "MINI_PCS";
    DonationType["ACCESSORIES"] = "ACCESSORIES";
    DonationType["CORPORATE_RECYCLING"] = "CORPORATE_RECYCLING";
    DonationType["SPONSOR_LEARNER"] = "SPONSOR_LEARNER";
    DonationType["SPONSOR_CLASSROOM_BUNDLE"] = "SPONSOR_CLASSROOM_BUNDLE";
    DonationType["SPONSOR_FULL_LAB"] = "SPONSOR_FULL_LAB";
    DonationType["MONTHLY_DONOR"] = "MONTHLY_DONOR";
})(DonationType || (exports.DonationType = DonationType = {}));
var DonationStatus;
(function (DonationStatus) {
    DonationStatus["NEW"] = "NEW";
    DonationStatus["REVIEWING"] = "REVIEWING";
    DonationStatus["CONTACTED"] = "CONTACTED";
    DonationStatus["COLLECTION_NEEDED"] = "COLLECTION_NEEDED";
    DonationStatus["COLLECTION_ARRANGED"] = "COLLECTION_ARRANGED";
    DonationStatus["PROCESSING"] = "PROCESSING";
    DonationStatus["RECEIVED"] = "RECEIVED";
    DonationStatus["COMPLETED"] = "COMPLETED";
    DonationStatus["CLOSED"] = "CLOSED";
})(DonationStatus || (exports.DonationStatus = DonationStatus = {}));
var DonationPriority;
(function (DonationPriority) {
    DonationPriority["LOW"] = "LOW";
    DonationPriority["MEDIUM"] = "MEDIUM";
    DonationPriority["HIGH"] = "HIGH";
})(DonationPriority || (exports.DonationPriority = DonationPriority = {}));
//# sourceMappingURL=donation.enums.js.map