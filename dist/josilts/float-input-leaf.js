"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leaf_1 = require("./leaf");
class FloatInputLeaf extends leaf_1.Leaf {
    constructor(inputName) {
        super("FLOAT INPUT", "FLOAT", "INPUT");
        this.inputName = inputName;
        this.name += "(" + this.inputName + ")";
    }
    getValue(input) {
        return input[this.inputName];
    }
}
exports.FloatInputLeaf = FloatInputLeaf;
//# sourceMappingURL=float-input-leaf.js.map