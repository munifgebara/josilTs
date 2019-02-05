import 'source-map-support/register'
import * as fs from 'fs';

import { ExternalParameters, Project } from "./josilts/project";
import { GPNode } from "./josilts/gp-node";
import { Individual } from "./josilts/individual";
import { Support } from "./josilts/support";

let externalParameters: ExternalParameters[] = [{ name: "y", type: "NUMBER" }, { name: "x", type: "NUMBER" }];
let pop: Individual[] = [];
//Support.readIndividual(pop, "bkp/d3d_BKP_best.json");

let p3d = new Project("d3d", externalParameters, "NUMBER", 5000, 4, Support.getBasicMatematicalFunctions(), pop);

let tv = Support.createTargetValuesFromExpression(externalParameters, "-x*x-y*y+1", -1, 1, 0.05);
p3d.targetValues = tv;

p3d.evolveN(45, 0.001);

let best = p3d.population[0];
let bestExpression = best.rootExpression;


let clone = bestExpression.createCopy();

clone.deepSimplify();
console.log(Support.getSimpleExpression2(clone));


