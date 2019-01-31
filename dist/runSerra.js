"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("./josilts/project");
const gp_node_1 = require("./josilts/gp-node");
const support_1 = require("./josilts/support");
const targetValues = support_1.Support.createTargetValuesFromCSV("samples/serra.min.csv");
const externalParameters = support_1.Support.createExternalParametersFromTargetValues(targetValues);
console.log(externalParameters);
const domainFunctions = [];
domainFunctions.push(new gp_node_1.GPNode("domingo", "FUNCTION", "NUMBER", "return externals['w']==1?1:i0", ["NUMBER"], 0));
domainFunctions.push(new gp_node_1.GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0));
domainFunctions.push(new gp_node_1.GPNode("SIN", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0));
domainFunctions.push(...support_1.Support.getBasicMatematicalFunctions());
let pop = [];
support_1.Support.readIndividual(pop, "bkp/serra_BKP_best.json");
let project = new project_1.Project("serra", externalParameters, "NUMBER", 3000, 10, domainFunctions, pop);
project.targetValues.push(...targetValues);
project.evolveN(12);
//# sourceMappingURL=runSerra.js.map