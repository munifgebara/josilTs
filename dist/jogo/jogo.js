"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Jogo {
    constructor() {
        this.state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    static isWinner(p, state) {
        for (let i = 0; i < Jogo.winnerCombinations.length; i++) {
            if (state[Jogo.winnerCombinations[i][0]] == p && state[Jogo.winnerCombinations[i][1]] == p && state[Jogo.winnerCombinations[i][2]] == p) {
                return true;
            }
        }
        return false;
        ;
    }
    isWinner(p) {
        return Jogo.isWinner(p, this.state);
    }
    hasPossibiliteToWin(player) {
        for (let i = 0; i < Jogo.winnerCombinations.length; i++) {
            let emptys = 0;
            let belogsToPlayer = false;
            let lastEmpty = 0;
            for (let j = 0; j < 3; j++) {
                if (!this.state[Jogo.winnerCombinations[i][j]]) {
                    emptys++;
                    lastEmpty = Jogo.winnerCombinations[i][j];
                }
                else {
                    belogsToPlayer = this.state[Jogo.winnerCombinations[i][j]] == player;
                }
                if (emptys == 2 && belogsToPlayer) {
                    return lastEmpty;
                }
            }
        }
        return -1;
    }
    moveToToWin(player) {
        for (let i = 0; i < 9; i++) {
            let newState = this.state.slice(0);
            if (newState[i] == 0) {
                newState[i] = player;
                if (Jogo.isWinner(player, newState)) {
                    return i;
                }
            }
        }
        return -1;
    }
    static empty(v) {
        return v == 0 ? ' ' : v;
    }
    displayState() {
        let l = "";
        l += `  ${Jogo.empty(this.state[0])}|${Jogo.empty(this.state[1])}|${Jogo.empty(this.state[2])}    \n`;
        l += `  -----    \n`;
        l += `  ${Jogo.empty(this.state[3])}|${Jogo.empty(this.state[4])}|${Jogo.empty(this.state[5])}    \n`;
        l += `  -----    \n`;
        l += `  ${Jogo.empty(this.state[6])}|${Jogo.empty(this.state[7])}|${Jogo.empty(this.state[8])}    \n`;
        console.log(l);
    }
    inteligentMove(player) {
        let nextMove = this.moveToToWin(player);
        if (nextMove >= 0) {
            return nextMove;
        }
        nextMove = this.moveToToWin(player == 1 ? 2 : 1);
        if (nextMove >= 0) {
            return nextMove;
        }
        nextMove = this.hasPossibiliteToWin(player);
        if (nextMove >= 0) {
            return nextMove;
        }
        if (this.state[4] == 0)
            return 4;
        if (this.state[0] == 0)
            return 0;
        if (this.state[2] == 0)
            return 2;
        if (this.state[6] == 0)
            return 6;
        if (this.state[8] == 0)
            return 8;
        if (this.state[1] == 0)
            return 1;
        if (this.state[3] == 0)
            return 3;
        if (this.state[5] == 0)
            return 5;
        if (this.state[7] == 0)
            return 6;
        return -1;
    }
    doInteligenteMove(player) {
        let p = this.inteligentMove(player);
        this.state[p] = player;
    }
    externalMove(position, player) {
        for (let ad = 0; ad < 9; ad++) {
            let p = Math.abs(Math.round(position) + ad) % 9;
            if (this.state[p] == 0) {
                this.state[p] = player;
                return;
            }
        }
    }
}
Jogo.winnerCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
exports.Jogo = Jogo;
//# sourceMappingURL=jogo.js.map