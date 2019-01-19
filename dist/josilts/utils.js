"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static floatRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    static integerRandom(min, max) {
        return Math.round(Math.random() * (max - min + 0.999) + min - 0.499);
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map