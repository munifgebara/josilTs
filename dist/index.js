"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const fs = require("fs");
const project_1 = require("./josilts/project");
const support_1 = require("./josilts/support");
function runPrimos() {
    let externalParameters = [{ name: "i", type: "NUMBER" }];
    let project1 = new project_1.Project("primos", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...support_1.Support.getBasicMatematicalFunctions(), ...support_1.Support.getAdvancedMatematicalFunctions()]);
    let n = fs.readFileSync("samples/primos.txt").toString().split("\r\n");
    let inc = 1;
    for (let i = 0; i < n.length; i += inc) {
        project1.targetValues.push({ i, output: n[i] });
        inc++;
    }
    project1.evolveN(parseInt(process.argv[4]));
}
exports.runPrimos = runPrimos;
//# sourceMappingURL=index.js.map