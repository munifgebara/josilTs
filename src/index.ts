import * as fs from 'fs';
import * as stringify from "json-stable-stringify";
import { Utils } from "./josilts/utils";
import { Project, ExternalParameters } from './josilts/project';
import { Individual } from './josilts/individual';
import { GPNode } from './josilts/gp-node';
import { Support } from './josilts/support';



export function runProject1() {
    let externalParameters: ExternalParameters[] = [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }];

    let domingo = new GPNode("domingo", "FUNCTION", "NUMBER", "return externals['w']==1?1:i0", ["NUMBER"], 0);
    let somaSimples = new GPNode("+", "FUNCTION", "NUMBER", "i0+i1", ["NUMBER", "NUMBER"], 0);


    let project1 = new Project("serra", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions(), domingo]);
    project1.targetValues.push(...Support.createTargetValuesFromCSV("samples/serra.min.csv"));
    project1.evolveN(parseInt(process.argv[4]));
}


export function runProject2() {
    let externalParameters: ExternalParameters[] = [{ name: "x", type: "NUMBER" }];
    let project2 = new Project("polinomial", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), Support.getBasicMatematicalFunctions());
    project2.targetValues.push(...Support.createTargetValuesFromExpression(project2.externalParameters, "x*x*x-2*x*x+4*x-8"));


    project2.evolveN(parseInt(process.argv[4]));
}
function runProject21() {

    let p3: Project = Project.getInstance(JSON.parse(fs.readFileSync("bkp/polinomial_BKP_project.json").toString()));
    p3.evolveN(parseInt(process.argv[4]));
}


export function runProject3() {
    let externalParameters: ExternalParameters[] = [{ name: "dia", type: "NUMBER" }];

    let project3 = new Project("dolar", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...Support.getBasicMatematicalFunctions(), ...Support.getAdvancedMatematicalFunctions()]);
    Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project3.targetValues.push({ ...vv, dia: vv.dia - 43125 }));

    project3.evolveN(parseInt(process.argv[4]));
}




export function runProject4() {
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


export function exemploDidatio() {
    let externalParameters: ExternalParameters[] = [{ name: "x", type: "NUMBER" }];
    const sin = new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0);
    const cos = new GPNode("SIN", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0);
    let didatico = new Project("didatico", externalParameters, "NUMBER", 400, 7, [...Support.getBasicMatematicalFunctions().filter(f => f.name != "mod"), sin], []);
    didatico.targetValues.push(...Support.createTargetValuesFromExpression(externalParameters, "4*Math.cos(x)", -Math.PI, Math.PI, 0.1));
    didatico.evolveN(50);
}



exemploDidatio();



//console.log(Support.createTargetValuesFromExpression([{ name: "x", type: "NUMBER" }], "2*x"));
/*


let b = Support.evalExpressionWithParameters("4*Math.cos(x)", { x: 0 });
console.log(b);


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



*/