import { Jogo } from "./jogo";

import * as fs from 'fs';


let prompt = require('prompt-sync')();

function teste1() {
    let j = new Jogo();
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

let j2 = new Jogo();


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





