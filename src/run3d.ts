import 'source-map-support/register'
import * as fs from 'fs';

import { ExternalParameters, Project } from "./josilts/project";
import { GPNode } from "./josilts/gp-node";
import { Individual } from "./josilts/individual";
import { Support } from "./josilts/support";
import { Utils } from './josilts/utils';

let externalParameters: ExternalParameters[] = [{ name: "y", type: "NUMBER" }, { name: "x", type: "NUMBER" }];
let pop: Individual[] = [];
Support.readIndividual(pop, "bkp/d3d_BKP_best.json");
Utils.seed = Utils.seed + Math.round(Math.random() * 1000000);

let p3d = new Project("d3d", externalParameters, "NUMBER", 5000, 4, Support.getBasicMatematicalFunctions(), pop);

let tv = Support.createTargetValuesFromExpression(externalParameters, "-x*x-y*y+1", -10, 10, 0.1);
p3d.targetValues = tv;

p3d.evolveN(15, 0);

let best = p3d.population[0];
let bestExpression = best.rootExpression;


let clone = bestExpression.createCopy();

clone.deepSimplify();
console.log(Support.getSimpleExpression2(clone));

/*
(((x*y)-((y*y)+(x*(y+x)))))

*/