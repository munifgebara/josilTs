"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leaf_1 = require("./leaf");
const utils_1 = require("./utils");
class FloatConstantLeaf extends leaf_1.Leaf {
    constructor(min, max) {
        super("FLOAT CONSTANT", "FLOAT", "CONSTANT");
        this.min = min;
        this.max = max;
        if (min > max) {
            this.min = max;
            this.max = min;
        }
        this.value = utils_1.Utils.floatRandom(this.min, this.max);
        this.name += "(" + this.value + ")";
        this.desc = "" + this.value;
    }
    getValue() {
        return this.value;
    }
    newIntance() {
        return new FloatConstantLeaf(this.min, this.max);
    }
    mudaValue(v) {
        this.value = v;
    }
    copy() {
        let n = new FloatConstantLeaf(this.min, this.max);
        n.value = this.value;
        n.name = "FLOAT CONSTANT(" + n.value + ")";
        n.desc = "" + n.value;
        return n;
    }
}
exports.FloatConstantLeaf = FloatConstantLeaf;
//# sourceMappingURL=float-costant-leaf.js.map