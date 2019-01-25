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
    project2.targetValues.push(...Support.createTargetValuesFromExpression(project2.externalParameters, "x*x*x-2*x*x+4*x-8"));

    let ppp = JSON.stringify(project2, null, 2);

    fs.writeFileSync("report/project.json", ppp, "utf-8");

    project2.evolveN(parseInt(process.argv[4]));


    let p3: Project = Project.getInstance(JSON.parse(ppp));
    p3.title += "COPY";


    p3.evolveN(parseInt(process.argv[4]));
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
    project1.evolveN(parseInt(process.argv[4]));
}



runProject2();

//console.log(Support.createTargetValuesFromExpression([{ name: "x", type: "NUMBER" }], "2*x"));

let c = new GPNode("", "CONSTANT", "NUMBER", "5");
let e = new GPNode("x", "EXTERNAL", "NUMBER");
let n = new GPNode("", "FUNCTION", "NUMBER", "return i0", ["NUMBER"], 0);
let s = new GPNode("add", "FUNCTION", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"], 0);
n.children.push(s);
s.children.push(c);
s.children.push(e);
console.log(n.label());
console.log(n.getExpression());
console.log(n.value({ x: 4 }, [s]));
Support.writeSVGToDisk("report/simples.svg", n.getDot("Principal"));

let BASICANODES = Support.getBasicMatematicalFunctions();



let n2 = new GPNode("", "FUNCTION", "NUMBER", "return i0", ["NUMBER"], 0);
n2.initChildren([...BASICANODES, e], 3);
Support.writeSVGToDisk("report/test.svg", n2.getDot("Principal"));
console.log(n2.label());
console.log(n2.getExpression());
console.log(n2.value({ x: 4 }, BASICANODES));

let j = JSON.stringify(n2, null, 2);

let n3: GPNode = GPNode.getInstance(JSON.parse(j));
console.log(n3.label());
console.log(n3.getExpression());
console.log(n3.value({ x: 4 }, BASICANODES));



