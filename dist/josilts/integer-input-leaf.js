"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leaf_1 = require("./leaf");
class IntegerInputLeaf extends leaf_1.Leaf {
    constructor(inputName) {
        super("INTEGER INPUT", "INTEGER", "INPUT");
        this.inputName = inputName;
        this.name += "(" + this.inputName + ")";
    }
    getValue(input) {
        return input[this.inputName];
    }
}
exports.IntegerInputLeaf = IntegerInputLeaf;
//# sourceMappingURL=integer-input-leaf.js.map