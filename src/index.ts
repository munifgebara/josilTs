import * as fs from 'fs';
import * as stringify from "json-stable-stringify";
import { Utils } from "./josilts/utils";
import { Project, ExternalParameters } from './josilts/project';
import { Individual } from './josilts/individual';
import { GPNode } from './josilts/gp-node';
import { Support } from './josilts/support';



function runProject1() {
    let project1 = new Project("serra", [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project1.targetValues.push(Support.createTargetValuesFromCSV("serra.min.csv"));
    project1.evolveN(parseInt(process.argv[4]));
}


function runProject2() {
    let externalParameters: ExternalParameters[] = [{ name: "x", type: "NUMBER" }];
    let project2 = new Project("polinomial", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), Support.getBasicMatematicalFunctions());
    project2.targetValues.push(Support.createTargetValuesFromExpression(project2.externalParameters, "x*x*x-2*x*x+4*x-8"));
    project2.evolveN(parseInt(process.argv[4]));
}


function runProject3() {
    let externalParameters: ExternalParameters[] = [{ name: "dia", type: "NUMBER" }];
    let project3 = new Project("dolar", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project3.targetValues.push(Support.createTargetValuesFromCSV("USD_BRL.csv"));
    project3.evolveN(parseInt(process.argv[4]));
}




function runProject4() {
    let externalParameters: ExternalParameters[] = [{ name: "i", type: "NUMBER" }];
    let project1 = new Project("primos", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    let n = fs.readFileSync("primos.txt").toString().split("\r\n");
    for (let i = 0; i < n.length; i += 10) {
        project1.targetValues.push({ i, output: n[i] });
    }
    console.log(n.length);
    project1.evolveN(parseInt(process.argv[4]));
}


runProject2();


