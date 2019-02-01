import { Individual } from "../josilts/individual";
import { Jogo } from "./jogo";



export class GameIndividual {



    public static updateGameFitnes(ind: Individual) {
        let jogo: Jogo = new Jogo();
        let points = 0;
        let winner = 0;
        for (let i = 0; i < 9; i++) {
            points++;
            let nextMove = GameIndividual.jogoValue(ind, jogo);
            jogo.externalMove(nextMove, 1);
            if (jogo.isWinner(1)) {
                winner = 1;
                break;
            }
            jogo.doInteligenteMove(2);
            if (jogo.isWinner(2)) {
                winner = 2;
                break;
            }
        }
        if (winner == 1) {
            points += 20;
        } else if (winner == 0) {
            points += 5;
        }
        else {
            points += 1;
        }
        let fitness = 1 / points;
        ind.fitness = fitness;
        return fitness;

    }

    public static jogoValue(ind: Individual, jogo: Jogo) {
        return ind.calculateValue({
            s0: jogo.state[0], s1: jogo.state[1], s2: jogo.state[2],
            s3: jogo.state[3], s4: jogo.state[4], s5: jogo.state[5],
            s6: jogo.state[6], s7: jogo.state[7], s8: jogo.state[8]
        });
    }


}