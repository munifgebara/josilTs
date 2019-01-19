"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leaf_1 = require("./leaf");
class BooleanConstantLeaf extends leaf_1.Leaf {
    constructor(value) {
        super("BOOLEAN CONSTANT", "BOOLEAN", "CONSTANT");
        this.value = value;
        this.name += "(" + this.value + ")";
        this.desc = "" + value;
    }
    getValue() {
        return this.value;
    }
    newIntance() {
        return new BooleanConstantLeaf(this.value);
    }
}
exports.BooleanConstantLeaf = BooleanConstantLeaf;
//# sourceMappingURL=boolean-costant-leaf.js.map