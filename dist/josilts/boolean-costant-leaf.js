"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leaf_1 = require("./leaf");
const utils_1 = require("./utils");
class BooleanConstantLeaf extends leaf_1.Leaf {
    constructor() {
        super("BOOLEAN CONSTANT", "BOOLEAN", "CONSTANT");
        this.value = utils_1.Utils.integerRandom(0, 1) == 1;
        this.name += "(" + this.value + ")";
    }
    getValue() {
        return this.value;
    }
}
exports.BooleanConstantLeaf = BooleanConstantLeaf;
//# sourceMappingURL=boolean-costant-leaf.js.map