import 'source-map-support/register'
import * as fs from 'fs';
import * as stringify from "json-stable-stringify";
import { Utils } from "./josilts/utils";
import { Project, ExternalParameters } from './josilts/project';
import { Individual } from './josilts/individual';
import { GPNode } from './josilts/gp-node';
import { Support } from './josilts/support';




export function runPrimos() {
    let externalParameters: ExternalParameters[] = [{ name: "i", type: "NUMBER" }];
    let project1 = new Project("primos", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions(), ...Support.getAdvancedMatematicalFunctions()]);
    let n = fs.readFileSync("samples/primos.txt").toString().split("\r\n");
    let inc = 1;
    for (let i = 0; i < n.length; i += inc) {
        project1.targetValues.push({ i, output: n[i] });
        inc++;
    }
    project1.evolveN(parseInt(process.argv[4]));
}




let pop: Individual[] = [];
Support.readIndividual(pop, "bkp/d3d_BKP_best.json");
let s1 = pop[0].rootExpression;
let s2 = pop[0].rootExpression.createCopy();


console.log(Support.getSimpleExpression2(s1));
Support.writeSVGToDisk(`report/Teste.svg`, s1.getDot());
console.log();
s2.deepSimplify();
s2.deepSimplify();
s2.deepSimplify();
s2.deepSimplify();
console.log(Support.getSimpleExpression2(s2));
Support.writeSVGToDisk(`report/TesteS.svg`, s2.getDot());

s1.updateH();
s2.updateH();

console.log(s1.h, s2.h);

let externals: any = { x: 1, y: 2 };
console.log((((0.15840608175695509 * externals['x']) - (externals['y'] - 0.424045252325324))));