"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const project_1 = require("./josilts/project");
const gp_node_1 = require("./josilts/gp-node");
const support_1 = require("./josilts/support");
const jogo_1 = require("./jogo/jogo");
const game_individual_1 = require("./jogo/game-individual");
function specialFitness(pop) {
    pop.forEach(ind => {
        game_individual_1.GameIndividual.updateGameFitnes(ind);
    });
}
let jogo = new jogo_1.Jogo();
const externalParameters = [];
for (let s = 0; s < 9; s++) {
    externalParameters.push({ name: "s" + s, type: "NUMBER" });
}
let pop = [];
let nodes = [];
nodes.push(...support_1.Support.getBasicMatematicalFunctions());
nodes.push(new gp_node_1.GPNode("firstEmpty", "FUNCTION", "NUMBER", "return  i0+externals.s0 == 0 ? 0 : externals.s1 == 0 ? 1 : externals.s2 == 0 ? 2 : externals.s3 == 0 ? 3 : externals.s4 == 0 ? 4 : externals.s5 == 0 ? 5 : externals.s6 == 0 ? 6 : externals.s7 == 0 ? 7 : externals.s8 == 0 ? 8 : -1;", ["NUMBER"], 0));
nodes.push(new gp_node_1.GPNode("lastEmpty", "FUNCTION", "NUMBER", "return   i0+externals.s8 == 0 ? 8 : externals.s7 == 0 ? 7 : externals.s6 == 0 ? 6 : externals.s5 == 0 ? 5 : externals.s4 == 0 ? 4 : externals.s3 == 0 ? 3 : externals.s2 == 0 ? 2 : externals.s1 == 0 ? 1 : externals.s0 == 0 ? 0 : -1;", ["NUMBER"], 0));
nodes.push(new gp_node_1.GPNode("bestEmpty", "FUNCTION", "NUMBER", "return   i0+externals.s4 == 0 ? 4 : externals.s0 == 0 ? 0 : externals.s2 == 0 ? 2 : externals.s6 == 0 ? 6 : externals.s8 == 0 ? 8 : externals.s1 == 0 ? 1 : externals.s3 == 0 ? 3 : externals.s5 == 0 ? 5 : externals.s7 == 0 ? 7: -1;", ["NUMBER"], 0));
nodes.push(new gp_node_1.GPNode("sin", "FUNCTION", "NUMBER", "return i1*Math.sin(i0)", ["NUMBER", "NUMBER"], 0));
let project = new project_1.Project("jogo", externalParameters, "NUMBER", 1000, 5, nodes, pop);
project.specialFitness = specialFitness;
project.evolveN(22);
let best = project.population[0];
let bestExpression = best.rootExpression;
let clone = bestExpression.createCopy();
//clone.deepSimplify();
console.log(support_1.Support.getSimpleExpression2(clone));
//# sourceMappingURL=runJogo.js.map