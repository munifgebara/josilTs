import 'source-map-support/register'
import { ExternalParameters, Project } from "./josilts/project";
import { GPNode } from "./josilts/gp-node";
import { Support } from "./josilts/support";
import { Individual } from "./josilts/individual";
import { Utils } from "./josilts/utils";
import { GameIndividual } from './jogo/game-individual';
import { Jogo } from './jogo/jogo';




let jogo: Jogo = new Jogo();



const externalParameters: ExternalParameters[] = [];
for (let s = 0; s < 9; s++) {
    externalParameters.push({ name: "s" + s, type: "NUMBER" });
}

let pop: Individual[] = [];

let nodes: GPNode[] = [];
nodes.push(new GPNode("firstEmpty", "FUNCTION", "NUMBER", "return return externals.s0 == 0 ? 0 : externals.s1 == 0 ? 1 : externals.s2 == 0 ? 2 : externals.s3 == 0 ? 3 : externals.s4 == 0 ? 4 : externals.s5 == 0 ? 5 : externals.s6 == 0 ? 6 : externals.s7 == 0 ? 7 : externals.s8 == 0 ? 8 : -1;", ["NUMBER"], 0));


let ind: GameIndividual = new GameIndividual(externalParameters, "NUMBER", 5, nodes);
pop.push(ind);




for (let i = 0; i < 9; i++) {
    let nextMove = jogoValue(ind, jogo);
    jogo.externalMove(nextMove, 1);
    jogo.displayState();
    if (jogo.isWinner(1)) {
        console.log("GP GANHOU!!");
        break;
    }
    jogo.doInteligenteMove(2);
    jogo.displayState();
    if (jogo.isWinner(2)) {
        console.log("Algoritimo tradicional GANHOU!!");
        break;
    }
}












process.exit(0);

const domainFunctions: GPNode[] = [];

domainFunctions.push(new GPNode("domingo", "FUNCTION", "NUMBER", "return externals['w']==1?1:i0", ["NUMBER"], 0));
domainFunctions.push(new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0));
domainFunctions.push(new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0));

domainFunctions.push(...Support.getBasicMatematicalFunctions());


Support.readIndividual(pop, "bkp/serra_BKP_best.json");
Utils.seed = Utils.seed + Math.round(Math.random() * 1000);
let project = new Project("serra", externalParameters, "NUMBER", 300, 10, domainFunctions, pop);
project.targetValues.push(...targetValues);
project.evolveN(22);




function jogoValue(ind: GameIndividual, jogo: Jogo) {
    return ind.calculateValue({
        s0: jogo.state[0], s1: jogo.state[1], s2: jogo.state[2],
        s3: jogo.state[3], s4: jogo.state[4], s5: jogo.state[5],
        s6: jogo.state[6], s7: jogo.state[7], s8: jogo.state[8]
    });
}