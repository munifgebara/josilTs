"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const project_1 = require("./josilts/project");
const gp_node_1 = require("./josilts/gp-node");
const support_1 = require("./josilts/support");
function runProject1() {
    let project1 = new project_1.Project("serra", [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project1.targetValues.push(support_1.Support.createTargetValuesFromCSV("serra.min.csv"));
    project1.evolveN(parseInt(process.argv[4]));
}
function runProject2() {
    let externalParameters = [{ name: "x", type: "NUMBER" }];
    let project2 = new project_1.Project("polinomial", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), support_1.Support.getBasicMatematicalFunctions());
    project2.targetValues.push(...support_1.Support.createTargetValuesFromExpression(project2.externalParameters, "x*x*x-2*x*x+4*x-8"));
    let ppp = JSON.stringify(project2, null, 2);
    fs.writeFileSync("report/project.json", ppp, "utf-8");
    project2.evolveN(parseInt(process.argv[4]));
    let p3 = project_1.Project.getInstance(JSON.parse(ppp));
    p3.title += "COPY";
    p3.evolveN(parseInt(process.argv[4]));
}
function runProject3() {
    let externalParameters = [{ name: "dia", type: "NUMBER" }];
    let project3 = new project_1.Project("dolar", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project3.targetValues.push(support_1.Support.createTargetValuesFromCSV("USD_BRL.csv"));
    project3.evolveN(parseInt(process.argv[4]));
}
function runProject4() {
    let externalParameters = [{ name: "i", type: "NUMBER" }];
    let project1 = new project_1.Project("primos", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    let n = fs.readFileSync("primos.txt").toString().split("\r\n");
    for (let i = 0; i < n.length; i += 10) {
        project1.targetValues.push({ i, output: n[i] });
    }
    project1.evolveN(parseInt(process.argv[4]));
}
runProject2();
//console.log(Support.createTargetValuesFromExpression([{ name: "x", type: "NUMBER" }], "2*x"));
let c = new gp_node_1.GPNode("", "CONSTANT", "NUMBER", "5");
let e = new gp_node_1.GPNode("x", "EXTERNAL", "NUMBER");
let n = new gp_node_1.GPNode("", "FUNCTION", "NUMBER", "return i0", ["NUMBER"], 0);
let s = new gp_node_1.GPNode("add", "FUNCTION", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"], 0);
n.children.push(s);
s.children.push(c);
s.children.push(e);
console.log(n.label());
console.log(n.getExpression());
console.log(n.value({ x: 4 }, [s]));
support_1.Support.writeSVGToDisk("report/simples.svg", n.getDot("Principal"));
let BASICANODES = support_1.Support.getBasicMatematicalFunctions();
let n2 = new gp_node_1.GPNode("", "FUNCTION", "NUMBER", "return i0", ["NUMBER"], 0);
n2.initChildren([...BASICANODES, e], 3);
support_1.Support.writeSVGToDisk("report/test.svg", n2.getDot("Principal"));
console.log(n2.label());
console.log(n2.getExpression());
console.log(n2.value({ x: 4 }, BASICANODES));
let j = JSON.stringify(n2, null, 2);
let n3 = gp_node_1.GPNode.getInstance(JSON.parse(j));
console.log(n3.label());
console.log(n3.getExpression());
console.log(n3.value({ x: 4 }, BASICANODES));
//# sourceMappingURL=index.js.map