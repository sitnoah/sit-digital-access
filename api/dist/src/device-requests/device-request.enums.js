"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRequestPriority = exports.DeviceRequestStatus = exports.DeviceCategory = void 0;
var DeviceCategory;
(function (DeviceCategory) {
    DeviceCategory["STUDENT_LAPTOPS"] = "STUDENT_LAPTOPS";
    DeviceCategory["BUSINESS_LAPTOPS"] = "BUSINESS_LAPTOPS";
    DeviceCategory["DESKTOP_PCS"] = "DESKTOP_PCS";
    DeviceCategory["MINI_PCS"] = "MINI_PCS";
    DeviceCategory["ALL_IN_ONE_PCS"] = "ALL_IN_ONE_PCS";
    DeviceCategory["COMPUTER_LAB_BUNDLES"] = "COMPUTER_LAB_BUNDLES";
    DeviceCategory["AI_LEARNING_LAB_BUNDLES"] = "AI_LEARNING_LAB_BUNDLES";
    DeviceCategory["ACCESSORIES"] = "ACCESSORIES";
})(DeviceCategory || (exports.DeviceCategory = DeviceCategory = {}));
var DeviceRequestStatus;
(function (DeviceRequestStatus) {
    DeviceRequestStatus["NEW"] = "NEW";
    DeviceRequestStatus["REVIEWING"] = "REVIEWING";
    DeviceRequestStatus["QUOTED"] = "QUOTED";
    DeviceRequestStatus["RESERVED"] = "RESERVED";
    DeviceRequestStatus["FULFILLED"] = "FULFILLED";
    DeviceRequestStatus["CLOSED"] = "CLOSED";
})(DeviceRequestStatus || (exports.DeviceRequestStatus = DeviceRequestStatus = {}));
var DeviceRequestPriority;
(function (DeviceRequestPriority) {
    DeviceRequestPriority["LOW"] = "LOW";
    DeviceRequestPriority["MEDIUM"] = "MEDIUM";
    DeviceRequestPriority["HIGH"] = "HIGH";
})(DeviceRequestPriority || (exports.DeviceRequestPriority = DeviceRequestPriority = {}));
//# sourceMappingURL=device-request.enums.js.map