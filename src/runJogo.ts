import 'source-map-support/register'
import * as fs from 'fs';
import { ExternalParameters, Project } from "./josilts/project";
import { GPNode } from "./josilts/gp-node";
import { Support } from "./josilts/support";
import { Individual } from "./josilts/individual";


import { Jogo } from './jogo/jogo';
import { GameIndividual } from './jogo/game-individual';


function specialFitness(pop: Individual[]) {
    pop.forEach(ind => {
        GameIndividual.updateGameFitnes(ind);

    });
}




let jogo: Jogo = new Jogo();



const externalParameters: ExternalParameters[] = [];
for (let s = 0; s < 9; s++) {
    externalParameters.push({ name: "s" + s, type: "NUMBER" });
}

let pop: Individual[] = [];

let nodes: GPNode[] = [];
nodes.push(...Support.getBasicMatematicalFunctions());
nodes.push(new GPNode("firstEmpty", "FUNCTION", "NUMBER", "return  i0+externals.s0 == 0 ? 0 : externals.s1 == 0 ? 1 : externals.s2 == 0 ? 2 : externals.s3 == 0 ? 3 : externals.s4 == 0 ? 4 : externals.s5 == 0 ? 5 : externals.s6 == 0 ? 6 : externals.s7 == 0 ? 7 : externals.s8 == 0 ? 8 : -1;", ["NUMBER"], 0));
nodes.push(new GPNode("lastEmpty", "FUNCTION", "NUMBER", "return   i0+externals.s8 == 0 ? 8 : externals.s7 == 0 ? 7 : externals.s6 == 0 ? 6 : externals.s5 == 0 ? 5 : externals.s4 == 0 ? 4 : externals.s3 == 0 ? 3 : externals.s2 == 0 ? 2 : externals.s1 == 0 ? 1 : externals.s0 == 0 ? 0 : -1;", ["NUMBER"], 0));
nodes.push(new GPNode("bestEmpty", "FUNCTION", "NUMBER", "return   i0+externals.s4 == 0 ? 4 : externals.s0 == 0 ? 0 : externals.s2 == 0 ? 2 : externals.s6 == 0 ? 6 : externals.s8 == 0 ? 8 : externals.s1 == 0 ? 1 : externals.s3 == 0 ? 3 : externals.s5 == 0 ? 5 : externals.s7 == 0 ? 7: -1;", ["NUMBER"], 0));
nodes.push(new GPNode("sin", "FUNCTION", "NUMBER", "return i1*Math.sin(i0)", ["NUMBER", "NUMBER"], 0));
let project = new Project("jogo", externalParameters, "NUMBER", 1000, 5, nodes, pop);
project.specialFitness = specialFitness;
project.evolveN(22);



let best = project.population[0];
let bestExpression = best.rootExpression;


let clone = bestExpression.createCopy();

//clone.deepSimplify();
console.log(Support.getSimpleExpression2(clone));








