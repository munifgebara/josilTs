
import { ExternalParameters, Project } from "./josilts/project";
import { GPNode } from "./josilts/gp-node";
import { Support } from "./josilts/support";
import { Individual } from "./josilts/individual";


const targetValues=Support.createTargetValuesFromCSV("samples/serra.min.csv");
const externalParameters=Support.createExternalParametersFromTargetValues(targetValues);
console.log(externalParameters);

const domainFunctions:GPNode[]=[];

domainFunctions.push(new GPNode("domingo", "FUNCTION", "NUMBER", "return externals['w']==1?1:i0", ["NUMBER"], 0));
domainFunctions.push( new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0));
domainFunctions.push( new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0));

domainFunctions.push(...Support.getBasicMatematicalFunctions());

let pop:Individual[]=[];
Support.readIndividual(pop,"bkp/serra_BKP_best.json");

let project = new Project("serra", externalParameters, "NUMBER",3000, 10, domainFunctions,pop);
project.targetValues.push(...targetValues);
project.evolveN(12);

