"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static resume(exp, n = 20) {
        return exp.length < n ? exp : (exp.substr(0, n) + "...");
    }
    static round(n) {
        return n;
        return Math.round(n * 100) / 100;
    }
    static floatRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
    static integerRandom(min, max) {
        return Math.round(Math.random() * (max - min + 0.999) + min - 0.499);
    }
    static indexRandom(array) {
        let r = Utils.integerRandom(0, array.length - 1);
        return r;
    }
    static replaceAll(somestring, oldString, newString) {
        return somestring.split(oldString).join(newString);
    }
    static fn(n, l = 20, d = 4) {
        return ("                    " + n.toFixed(d)).slice(-l);
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map