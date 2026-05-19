"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryType = exports.EnquiryPriority = exports.EnquiryStatus = void 0;
var EnquiryStatus;
(function (EnquiryStatus) {
    EnquiryStatus["NEW"] = "NEW";
    EnquiryStatus["REVIEWING"] = "REVIEWING";
    EnquiryStatus["CONTACTED"] = "CONTACTED";
    EnquiryStatus["QUALIFIED"] = "QUALIFIED";
    EnquiryStatus["CLOSED"] = "CLOSED";
})(EnquiryStatus || (exports.EnquiryStatus = EnquiryStatus = {}));
var EnquiryPriority;
(function (EnquiryPriority) {
    EnquiryPriority["LOW"] = "LOW";
    EnquiryPriority["MEDIUM"] = "MEDIUM";
    EnquiryPriority["HIGH"] = "HIGH";
})(EnquiryPriority || (exports.EnquiryPriority = EnquiryPriority = {}));
var EnquiryType;
(function (EnquiryType) {
    EnquiryType["CONTACT"] = "CONTACT";
    EnquiryType["REQUEST_DEVICES"] = "REQUEST_DEVICES";
    EnquiryType["PARTNERSHIP"] = "PARTNERSHIP";
    EnquiryType["AFRICA_DEPLOYMENT"] = "AFRICA_DEPLOYMENT";
    EnquiryType["SCHOOL_LAB"] = "SCHOOL_LAB";
    EnquiryType["SCHOOL_ENQUIRY"] = "SCHOOL_ENQUIRY";
    EnquiryType["SME_NGO"] = "SME_NGO";
    EnquiryType["DEVICE_DONATION"] = "DEVICE_DONATION";
    EnquiryType["IT_SUPPORT"] = "IT_SUPPORT";
    EnquiryType["SPONSORSHIP"] = "SPONSORSHIP";
    EnquiryType["PROGRAMME_ENQUIRY"] = "PROGRAMME_ENQUIRY";
    EnquiryType["SERVICE_ENQUIRY"] = "SERVICE_ENQUIRY";
})(EnquiryType || (exports.EnquiryType = EnquiryType = {}));
//# sourceMappingURL=enquiry.enums.js.map