"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const fs = require("fs");
const project_1 = require("./josilts/project");
const support_1 = require("./josilts/support");
let externalParameters = [{ name: "x", type: "NUMBER" }];
let didatico = new project_1.Project("didatico", externalParameters, "NUMBER", 8, 4);
didatico.targetValues.push({ x: 0, output: 1 });
didatico.targetValues.push({ x: 1, output: 2 });
didatico.targetValues.push({ x: 2, output: 5 });
didatico.targetValues.push({ x: 3, output: 10 });
didatico.targetValues.push({ x: 4, output: 17 });
didatico.targetValues.push({ x: 5, output: 26 });
fs.writeFileSync(`pop/${didatico.title}_${didatico.generation}.dot`, didatico.getPopulationAsDot());
didatico.evolveN(10, 0.001);
let best = didatico.population[0];
let bestExpression = best.rootExpression;
let clone = bestExpression.createCopy();
console.log(support_1.Support.getSimpleExpression2(bestExpression));
console.log(support_1.Support.getSimpleExpression2(clone));
clone.deepSimplify();
console.log(support_1.Support.getSimpleExpression2(clone));
//# sourceMappingURL=runDidatico.js.map