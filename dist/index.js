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
let pop = [];
support_1.Support.readIndividual(pop, "bkp/d3d_BKP_best.json");
let s1 = pop[0].rootExpression;
let s2 = pop[0].rootExpression.createCopy();
console.log(support_1.Support.getSimpleExpression2(s1));
support_1.Support.writeSVGToDisk(`report/Teste.svg`, s1.getDot());
console.log();
s2.deepSimplify();
s2.deepSimplify();
s2.deepSimplify();
s2.deepSimplify();
console.log(support_1.Support.getSimpleExpression2(s2));
support_1.Support.writeSVGToDisk(`report/TesteS.svg`, s2.getDot());
s1.updateH();
s2.updateH();
console.log(s1.h, s2.h);
let externals = { x: 1, y: 2 };
console.log((((0.15840608175695509 * externals['x']) - (externals['y'] - 0.424045252325324))));
//# sourceMappingURL=index.js.map