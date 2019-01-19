"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leaf_1 = require("./leaf");
const utils_1 = require("./utils");
class IntegerConstantLeaf extends leaf_1.Leaf {
    constructor(min, max) {
        super("INTEGER CONSTANT", "INTEGER", "CONSTANT");
        this.min = min;
        this.max = max;
        if (min > max) {
            this.min = max;
            this.max = min;
        }
        this.value = utils_1.Utils.integerRandom(this.min, this.max);
        this.name += "(" + this.value + ")";
    }
    getValue() {
        return this.value;
    }
}
exports.IntegerConstantLeaf = IntegerConstantLeaf;
//# sourceMappingURL=integer-costant-leaf.js.map