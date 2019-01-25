"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const project_1 = require("./josilts/project");
const support_1 = require("./josilts/support");
function runProject1() {
    let project1 = new project_1.Project("serra", [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project1.targetValues.push(support_1.Support.createTargetValuesFromCSV("serra.min.csv"));
    project1.evolveN(parseInt(process.argv[4]));
}
function runProject2() {
    let externalParameters = [{ name: "x", type: "NUMBER" }];
    let project2 = new project_1.Project("polinomial", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), support_1.Support.getBasicMatematicalFunctions());
    project2.targetValues.push(support_1.Support.createTargetValuesFromExpression(project2.externalParameters, "x*x*x-2*x*x+4*x-8"));
    project2.evolveN(parseInt(process.argv[4]));
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
    console.log(n.length);
    project1.evolveN(parseInt(process.argv[4]));
}
runProject2();
//# sourceMappingURL=index.js.map