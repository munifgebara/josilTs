
import { ExternalParameters, Project } from "./josilts/project";
import { GPNode } from "./josilts/gp-node";
import { Support } from "./josilts/support";
import { Individual } from "./josilts/individual";


const targetValues = Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").map(v => ({ vi: v.index, output: v.output }));
//console.log(targetValues);
const externalParameters = Support.createExternalParametersFromTargetValues(targetValues);
console.log(externalParameters);
const domainFunctions: GPNode[] = [];


domainFunctions.push(new GPNode("sin", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0));
domainFunctions.push(new GPNode("cos", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0));

domainFunctions.push(...Support.getBasicMatematicalFunctions());
domainFunctions.push(...Support.getAdvancedMatematicalFunctions());


let pop: Individual[] = [];
Support.readIndividual(pop, "bkp/dollar_BKP_best.json");

let project = new Project("dollar", externalParameters, "NUMBER", 3000, 6, domainFunctions, pop);
project.targetValues.push(...targetValues);
project.evolveN(1200);

let best = project.population[0];
let bestExpression = best.rootExpression;

let clone = bestExpression.createCopy();
console.log(Support.getSimpleExpression2(bestExpression));
clone.deepSimplify();
console.log(Support.getSimpleExpression2(clone));




