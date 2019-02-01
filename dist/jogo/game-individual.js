"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const individual_1 = require("../josilts/individual");
const jogo_1 = require("./jogo");
class GameIndividual extends individual_1.Individual {
    updateGameFitnes() {
        let jogo = new jogo_1.Jogo();
        let points = 0;
        let winner = 0;
        for (let i = 0; i < 9; i++) {
            points++;
            let nextMove = GameIndividual.jogoValue(this, jogo);
            jogo.externalMove(nextMove, 1);
            jogo.displayState();
            if (jogo.isWinner(1)) {
                console.log("GP GANHOU!!");
                winner = 1;
                points += 10;
                break;
            }
            jogo.doInteligenteMove(2);
            jogo.displayState();
            if (jogo.isWinner(2)) {
                points += 1;
                winner = 2;
                break;
            }
        }
        if (winner == 1) {
            points += 10;
        }
        else if (winner == 0) {
            points += 5;
        }
        else {
            points += 1;
        }
        let fitness = 1 / points;
        this.fitness = fitness;
        return fitness;
    }
    static jogoValue(ind, jogo) {
        return ind.calculateValue({
            s0: jogo.state[0], s1: jogo.state[1], s2: jogo.state[2],
            s3: jogo.state[3], s4: jogo.state[4], s5: jogo.state[5],
            s6: jogo.state[6], s7: jogo.state[7], s8: jogo.state[8]
        });
    }
}
exports.GameIndividual = GameIndividual;
//# sourceMappingURL=game-individual.js.map