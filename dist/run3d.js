"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const project_1 = require("./josilts/project");
const support_1 = require("./josilts/support");
let externalParameters = [{ name: "y", type: "NUMBER" }, { name: "x", type: "NUMBER" }];
let pop = [];
//Support.readIndividual(pop, "bkp/d3d_BKP_best.json");
let p3d = new project_1.Project("d3d", externalParameters, "NUMBER", 5000, 4, support_1.Support.getBasicMatematicalFunctions(), pop);
let tv = support_1.Support.createTargetValuesFromExpression(externalParameters, "-x*x-y*y+1", -1, 1, 0.05);
p3d.targetValues = tv;
p3d.evolveN(45, 0.001);
let best = p3d.population[0];
let bestExpression = best.rootExpression;
let clone = bestExpression.createCopy();
clone.deepSimplify();
console.log(support_1.Support.getSimpleExpression2(clone));
//# sourceMappingURL=run3d.js.map