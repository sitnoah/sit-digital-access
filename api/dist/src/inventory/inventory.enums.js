"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryStatus = exports.ConditionGrade = void 0;
var ConditionGrade;
(function (ConditionGrade) {
    ConditionGrade["A"] = "A";
    ConditionGrade["B"] = "B";
    ConditionGrade["C"] = "C";
    ConditionGrade["PARTS_REPAIR"] = "PARTS_REPAIR";
})(ConditionGrade || (exports.ConditionGrade = ConditionGrade = {}));
var InventoryStatus;
(function (InventoryStatus) {
    InventoryStatus["AVAILABLE"] = "AVAILABLE";
    InventoryStatus["RESERVED"] = "RESERVED";
    InventoryStatus["DEPLOYED"] = "DEPLOYED";
    InventoryStatus["REPAIR"] = "REPAIR";
    InventoryStatus["RETIRED"] = "RETIRED";
})(InventoryStatus || (exports.InventoryStatus = InventoryStatus = {}));
//# sourceMappingURL=inventory.enums.js.map