"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const fs = require("fs");
const project_1 = require("./josilts/project");
const individual_1 = require("./josilts/individual");
const gp_node_1 = require("./josilts/gp-node");
const support_1 = require("./josilts/support");
function runProject1() {
    let externalParameters = [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }];
    let domingo = new gp_node_1.GPNode("domingo", "FUNCTION", "NUMBER", "return externals['w']==1?1:i0", ["NUMBER"], 0);
    const sin = new gp_node_1.GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0);
    const cos = new gp_node_1.GPNode("SIN", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0);
    const nodes = [...support_1.Support.getBasicMatematicalFunctions(), domingo, sin, cos];
    // console.log(ind.getInfo());
    // ind.updateFitness(targetValues);
    // console.log(ind.getInfo());
    // ind.rootExpression.updateH();
    // console.log(ind.getInfo());
    // ind.rootExpression.simplify(nodes);
    // ind.updateFitness(targetValues);
    // ind.rootExpression.updateH();
    // console.log(ind.getInfo());
    //    process.exit(0);
    let project1 = new project_1.Project("serra", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), nodes);
    project1.targetValues.push(...support_1.Support.createTargetValuesFromCSV("samples/serra.min.csv"));
    project1.evolveN(parseInt(process.argv[4]));
}
exports.runProject1 = runProject1;
function runProject2() {
    let externalParameters = [{ name: "x", type: "NUMBER" }];
    let project2 = new project_1.Project("polinomial", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), support_1.Support.getBasicMatematicalFunctions());
    project2.targetValues.push(...support_1.Support.createTargetValuesFromExpression(project2.externalParameters, "x*x*x-2*x*x+4*x-8"));
    project2.evolveN(parseInt(process.argv[4]));
}
exports.runProject2 = runProject2;
function runProject21() {
    let p3 = project_1.Project.getInstance(JSON.parse(fs.readFileSync("bkp/polinomial_BKP_project.json").toString()));
    p3.evolveN(parseInt(process.argv[4]));
}
function runProject3() {
    let externalParameters = [{ name: "dia", type: "NUMBER" }];
    let project3 = new project_1.Project("dolar", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...support_1.Support.getBasicMatematicalFunctions(), ...support_1.Support.getAdvancedMatematicalFunctions()]);
    support_1.Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project3.targetValues.push(Object.assign({}, vv, { dia: vv.dia - 43125 })));
    project3.evolveN(parseInt(process.argv[4]));
}
exports.runProject3 = runProject3;
function runProject4() {
    let externalParameters = [{ name: "i", type: "NUMBER" }];
    let project1 = new project_1.Project("primos", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...support_1.Support.getBasicMatematicalFunctions(), ...support_1.Support.getAdvancedMatematicalFunctions()]);
    let n = fs.readFileSync("samples/primos.txt").toString().split("\r\n");
    let inc = 1;
    for (let i = 0; i < n.length; i += inc) {
        project1.targetValues.push({ i, output: n[i] });
        inc++;
    }
    project1.evolveN(parseInt(process.argv[4]));
}
exports.runProject4 = runProject4;
function exemploDidatio() {
    let externalParameters = [{ name: "x", type: "NUMBER" }];
    const sin = new gp_node_1.GPNode("SIN", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0);
    const cos = new gp_node_1.GPNode("COS", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0);
    let initialPopulation = [];
    if (fs.existsSync('bkp/didatico_BKP_best.json')) {
        let ind = individual_1.Individual.getInstance(JSON.parse(fs.readFileSync('bkp/didatico_BKP_best.json').toString()));
        ind.rootExpression.deepSimplify();
        initialPopulation.push(ind);
    }
    let didatico = new project_1.Project("didatico", externalParameters, "NUMBER", 1000, 5, [...support_1.Support.getBasicMatematicalFunctions().filter(f => f.name != "mod" && f.name != "div"), sin, cos], initialPopulation);
    //didatico.targetValues.push(...Support.createTargetValuesFromExpression(externalParameters, "4*Math.cos(x+5)", -Math.PI, Math.PI, 0.1));
    didatico.targetValues.push(...support_1.Support.createTargetValuesFromCSV("samples/serra.min.csv"));
    didatico.population[0].fitness = -1;
    didatico.evolveWithBest();
    didatico.evolveN(20, 0.01);
    console.log(`s  ===>  ${didatico.population[0].id}  ${support_1.Support.getSimpleExpression(didatico.population[0].rootExpression)}`);
}
exports.exemploDidatio = exemploDidatio;
//exemploDidatio();
//let ind: Individual = Individual.getInstance(JSON.parse(fs.readFileSync("samples/serra_BKP_best.json", "utf8").toString()));
//console.log(ind.fitness);
//console.log(ind.rootExpression.h);
//let targetValues: any[] = [...Support.createTargetValuesFromCSV("samples/serra.min.csv")];
//console.log(Support.createTargetValuesFromExpression([{ name: "x", type: "NUMBER" }], "2*x"));
//let b = Support.evalExpressionWithParameters("4*Math.cos(x)", { x: 0 });
//console.log(b);
function test() {
    let c = new gp_node_1.GPNode("", "CONSTANT", "NUMBER", "1");
    let c2 = new gp_node_1.GPNode("", "CONSTANT", "NUMBER", "2");
    let c3 = new gp_node_1.GPNode("", "CONSTANT", "NUMBER", "3");
    let c4 = new gp_node_1.GPNode("", "CONSTANT", "NUMBER", "4");
    let e = new gp_node_1.GPNode("x", "EXTERNAL", "NUMBER");
    let n = new gp_node_1.GPNode("", "FUNCTION", "NUMBER", "return i0", ["NUMBER"], 0);
    let s = new gp_node_1.GPNode("add", "FUNCTION", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"], 0);
    let m = new gp_node_1.GPNode("mull", "FUNCTION", "NUMBER", "return i0*i1;", ["NUMBER", "NUMBER"], 0);
    let s1 = s.createCopy();
    let s2 = s.createCopy();
    n.children.push(s);
    s.children.push(e, m);
    m.children.push(s1, s2);
    s1.children.push(c, c2);
    s2.children.push(c3, c4);
    console.log(`n ===> ${support_1.Support.getSimpleExpression(n)}`);
    gp_node_1.GPNode.ALL.forEach(g => {
        console.log(g.id, g.label(), g.code, g.isPureConstant());
    });
    s.deepSimplify();
    gp_node_1.GPNode.ALL.forEach(g => {
        console.log(g.id, g.label(), g.code, g.isPureConstant());
    });
    console.log(`n ===> ${support_1.Support.getSimpleExpression(n)}`);
}
//# sourceMappingURL=index.js.map