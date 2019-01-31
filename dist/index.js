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
function runProject31() {
    let initialPopulation = [];
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar1_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar2_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar3_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar4_BKP_best.json');
    let csv = support_1.Support.createTargetValuesFromCSV("samples/USD_BRL21.csv");
    let externalParameters = support_1.Support.createExternalParametersFromTargetValues(csv);
    let project1 = new project_1.Project("dolar1", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...support_1.Support.getBasicMatematicalFunctions()], initialPopulation);
    support_1.Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project1.targetValues.push(Object.assign({}, vv, { dia: vv.dia - 43125 })));
    project1.population[0].fitness = -1;
    //project1.evolveWithBest(4);
    project1.evolveN(parseInt(process.argv[4]));
}
exports.runProject31 = runProject31;
function runProject32() {
    const sin = new gp_node_1.GPNode("sin", "FUNCTION", "NUMBER", "return Math.sin(i0)", ["NUMBER"], 0);
    const cos = new gp_node_1.GPNode("cos", "FUNCTION", "NUMBER", "return Math.cos(i0)", ["NUMBER"], 0);
    let initialPopulation = [];
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar2_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar1_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar3_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar4_BKP_best.json');
    let csv = support_1.Support.createTargetValuesFromCSV("samples/USD_BRL21.csv");
    let externalParameters = support_1.Support.createExternalParametersFromTargetValues(csv);
    let project2 = new project_1.Project("dolar2", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...support_1.Support.getBasicMatematicalFunctions(), sin, cos], initialPopulation);
    support_1.Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project2.targetValues.push(Object.assign({}, vv, { dia: vv.dia - 43125 })));
    project2.population[0].fitness = -1;
    //project2.evolveWithBest(4);
    project2.evolveN(parseInt(process.argv[4]));
}
exports.runProject32 = runProject32;
function runProject33() {
    let initialPopulation = [];
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar3_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar1_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar2_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar4_BKP_best.json');
    let csv = support_1.Support.createTargetValuesFromCSV("samples/USD_BRL21.csv");
    let externalParameters = support_1.Support.createExternalParametersFromTargetValues(csv);
    let project3 = new project_1.Project("dolar3", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...support_1.Support.getBasicMatematicalFunctions(), ...support_1.Support.getAdvancedMatematicalFunctions()], initialPopulation);
    support_1.Support.createTargetValuesFromCSV("samples/USD_BRL21.csv").forEach(vv => project3.targetValues.push(Object.assign({}, vv, { dia: vv.dia - 43125 })));
    project3.population[0].fitness = -1;
    //project3.evolveWithBest(4);
    project3.evolveN(parseInt(process.argv[4]));
}
exports.runProject33 = runProject33;
function runProject34() {
    let initialPopulation = [];
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar4_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar2_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar3_BKP_best.json');
    support_1.Support.readIndividual(initialPopulation, 'bkp/dolar1_BKP_best.json');
    let csv = support_1.Support.createTargetValuesFromCSV("samples/USD_BRL21.csv");
    let externalParameters = support_1.Support.createExternalParametersFromTargetValues(csv);
    let project4 = new project_1.Project("dolar4", externalParameters, "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]), [...support_1.Support.getBasicMatematicalFunctions(), ...support_1.Support.getRelationalFunctions()], initialPopulation);
    project4.population[0].fitness = -1;
    //project4.evolveWithBest(4);
    project4.evolveN(parseInt(process.argv[4]));
}
exports.runProject34 = runProject34;
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
    didatico.targetValues.push(...support_1.Support.createTargetValuesFromExpression(externalParameters, "4*Math.cos(x+5)", -Math.PI, Math.PI, 0.1));
    //didatico.targetValues.push(...Support.createTargetValuesFromCSV("samples/serra.min.csv"));
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
function dolar(dia) {
    return ((0.8145545593930124 + ((((dia == 0 ? 1 : ((dia == 0 ? 1 : 0.13422154488305327 / dia) + (0.9828376938267065 + ((((dia == 0 ? 1 : 0.044742675869120285 / dia) + 0.3781506311397911) + 0.07564166092334146) + dia))) / dia) + 0.5660886616524758) + 0.21942237255193286) + (((dia == 0 ? 1 : (dia == 0 ? 1 : ((((dia == 0 ? 1 : 0.15258120062253688 / dia) + 0.9040615196782311) + 0.8623428496068903) == 0 ? 1 : ((((((dia + 0.1733562586321844) + 0.22055015231039898) + (dia + ((((((dia == 0 ? 1 : 0.8055764435324262 / dia) + (dia == 0 ? 1 : 0.5235131328987639 / dia)) + 0.8144868699620966) == 0 ? 1 : (((dia + (0.9091329708461711 + (0.624083898189441 + ((dia == 0 ? 1 : ((((dia + 0.3274168501911656) + 0.9938275244744488) + (((dia + 0.5239564330304838) + 0.8826371865477824) + 0.9935586627518622)) / 0.7102673185264368) / dia) + 0.9420784888421831)))) + 0.8699997796278887) + 0.6914727987515659) / (((dia == 0 ? 1 : 0.8055764435324262 / dia) + (dia == 0 ? 1 : 0.5235131328987639 / dia)) + 0.8144868699620966)) + 0.2553712175020164) + 0.1264880687769654))) + 0.45300717950917213) + 0.6370594272942034) + 0.9271422923198092) / (((dia == 0 ? 1 : 0.15258120062253688 / dia) + 0.9040615196782311) + 0.8623428496068903)) / dia) / dia) + 0.41612083161345437) == 0 ? 1 : 0.684397582833745 / ((dia == 0 ? 1 : (dia == 0 ? 1 : ((((dia == 0 ? 1 : 0.15258120062253688 / dia) + 0.9040615196782311) + 0.8623428496068903) == 0 ? 1 : ((((((dia + 0.1733562586321844) + 0.22055015231039898) + (dia + ((((((dia == 0 ? 1 : 0.8055764435324262 / dia) + (dia == 0 ? 1 : 0.5235131328987639 / dia)) + 0.8144868699620966) == 0 ? 1 : (((dia + (0.9091329708461711 + (0.624083898189441 + (1 + 0.9420784888421831)))) + 0.8699997796278887) + 0.6914727987515659) / (((dia == 0 ? 1 : 0.8055764435324262 / dia) + (dia == 0 ? 1 : 0.5235131328987639 / dia)) + 0.8144868699620966)) + 0.2553712175020164) + 0.1264880687769654))) + 0.45300717950917213) + 0.6370594272942034) + 0.9271422923198092) / (((dia == 0 ? 1 : 0.15258120062253688 / dia) + 0.9040615196782311) + 0.8623428496068903)) / dia) / dia) + 0.41612083161345437)))));
}
console.log(dolar(1));
//# sourceMappingURL=index.js.map