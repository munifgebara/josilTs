"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static floatRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    static integerRandom(min, max) {
        return Math.round(Math.random() * (max - min + 0.999) + min - 0.499);
    }
    static indexRandom(array) {
        let r = Utils.integerRandom(0, array.length - 1);
        console.log("ir", 0, array.length - 1, r);
        return r;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map