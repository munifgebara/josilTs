"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jogo_1 = require("./jogo");
function teste1() {
    let j = new jogo_1.Jogo();
    j.state[0] = 1;
    j.state[1] = 1;
    j.state[2] = 1;
    j.displayState();
    console.log(1, j.isWinner(1));
    j.state[0] = 2;
    j.state[4] = 2;
    j.state[8] = 2;
    j.displayState();
    console.log(2, j.isWinner(2));
    j.state[0] = 0;
    j.displayState();
    console.log(j.hasPossibiliteToWin(1));
    console.log(j.hasPossibiliteToWin(2));
}
let j2 = new jogo_1.Jogo();
j2.displayState();
console.log(j2.moveToToWin(1));
console.log(j2.moveToToWin(2));
let p = 1;
let n = 100;
while (n >= 0) {
    n = j2.inteligentMove(p);
    if (n >= 0) {
        j2.state[n] = p;
        p = p == 1 ? 2 : 1;
        j2.displayState();
    }
}
////console.log(j2.hasPossibiliteToWin(1));
////console.log(j2.hasPossibiliteToWin(2));
//# sourceMappingURL=testa-jogo.js.map