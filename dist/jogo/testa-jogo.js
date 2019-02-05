"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jogo_1 = require("./jogo");
let prompt = require('prompt-sync')();
function tt() {
    let j = new jogo_1.Jogo();
    for (let i = 0; i < 5; i++) {
        j.state[adjustPosition(nm(j.state[0], j.state[1], j.state[2], j.state[3], j.state[4], j.state[5], j.state[6], j.state[7], j.state[8]), j)] = 1;
        if (j.isWinner(1)) {
            j.displayState();
            console.log("1 ganhou");
            break;
        }
        j.doInteligenteMove(2);
        if (j.isWinner(1)) {
            j.displayState();
            console.log("2 ganhou");
            break;
        }
        j.displayState();
    }
}
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
function ff4() {
    let j2 = new jogo_1.Jogo();
    j2.displayState();
    console.log(j2.moveToToWin(1));
    console.log(j2.moveToToWin(2));
    let p = 2;
    let n = 100;
    while (n >= 0) {
        let ps = prompt('Your move:');
        if (j2.state[ps] == 0) {
            j2.state[ps] = 1;
            if (j2.isWinner(1)) {
                console.log("1 ganhou");
                break;
            }
            n = j2.inteligentMove(p);
            if (n >= 0) {
                j2.state[n] = p;
                //p = p == 1 ? 2 : 1;
                if (j2.isWinner(2)) {
                    console.log("2 ganhou");
                    break;
                }
                j2.displayState();
            }
        }
        else {
            console.log("Movimento ilegal");
        }
    }
    j2.displayState();
}
let j = new jogo_1.Jogo();
j.displayState();
let n = 100;
while (n >= 0) {
    let ps = adjustPosition(nm(j.state[0], j.state[1], j.state[2], j.state[3], j.state[4], j.state[5], j.state[6], j.state[7], j.state[8]), j);
    j.state[ps] = 1;
    j.displayState();
    if (j.isWinner(1)) {
        j.displayState();
        console.log("1 ganhou");
        break;
    }
    n = prompt('Your move:');
    if (j.state[n] == 0) {
        j.state[n] = 2;
        if (j.isWinner(2)) {
            j.displayState();
            console.log("2 ganhou");
            break;
        }
    }
    else {
        console.log("Movimento ilegal");
    }
}
j.displayState();
function nm(s0, s1, s2, s3, s4, s5, s6, s7, s8) {
    //return ((((0.62374736007652 + s8 == 0 ? 8 : s7 == 0 ? 7 : s6 == 0 ? 6 : s5 == 0 ? 5 : s4 == 0 ? 4 : s3 == 0 ? 3 : s2 == 0 ? 2 : s1 == 0 ? 1 : s0 == 0 ? 0 : -1) * (((((s1 + s8 == 0 ? 8 : s7 == 0 ? 7 : s6 == 0 ? 6 : s5 == 0 ? 5 : s4 == 0 ? 4 : s3 == 0 ? 3 : s2 == 0 ? 2 : s1 == 0 ? 1 : s0 == 0 ? 0 : -1) * Math.sin(((0.03417910824919036 == 0 ? s7 : s7 % 0.03417910824919036) + s4 == 0 ? 4 : s0 == 0 ? 0 : s2 == 0 ? 2 : s6 == 0 ? 6 : s8 == 0 ? 8 : s1 == 0 ? 1 : s3 == 0 ? 3 : s5 == 0 ? 5 : s7 == 0 ? 7 : -1))) + 0.8029754960937198) + 0.21806196376500833) + s8 == 0 ? 8 : s7 == 0 ? 7 : s6 == 0 ? 6 : s5 == 0 ? 5 : s4 == 0 ? 4 : s3 == 0 ? 3 : s2 == 0 ? 2 : s1 == 0 ? 1 : s0 == 0 ? 0 : -1)) + ((0.06814321649087893 == 0 ? 1 : (s1 + s8 == 0 ? 8 : s7 == 0 ? 7 : s6 == 0 ? 6 : s5 == 0 ? 5 : s4 == 0 ? 4 : s3 == 0 ? 3 : s2 == 0 ? 2 : s1 == 0 ? 1 : s0 == 0 ? 0 : -1) / 0.06814321649087893) + (s7 == 0 ? 1 : s6 / s7))));
    return 1;
}
function adjustPosition(position, j) {
    for (let ad = 0; ad < 9; ad++) {
        let p = Math.abs(Math.round(position) + ad) % 9;
        if (j.state[p] == 0) {
            console.log(p);
            return p;
        }
    }
    return -1;
}
//# sourceMappingURL=testa-jogo.js.map