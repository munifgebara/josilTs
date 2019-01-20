"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const stringify = require("json-stable-stringify");
const project_1 = require("./josilts/project");
const individual_1 = require("./josilts/individual");
const gp_node_1 = require("./josilts/gp-node");
console.log("teste");
function testaProject() {
    let project = new project_1.Project("f2", ["NUMBER", "NUMBER"], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    for (let y = -10; y <= 10; y += 1) {
        for (let x = -10; x <= 10; x += 1) {
            project.targetValues.push({ input: [x, y], output: x * y + 2 * x + 3 * y - 3 });
        }
    }
    let best = project.population[0];
    for (let ge = 0; ge <= parseInt(process.argv[4]); ge++) {
        process.stdout.write("                                                                           Offspring " + ge + " " + project.avgFit + "\r");
        best = project.getBest();
        fs.writeFileSync(`report/best.dot`, best.rootExpression.getDot(), "utf-8");
        fs.writeFileSync(`report/pior.dot`, project.population[project.populationSize - 1], "utf-8");
        project.evolve();
    }
    console.log(parseInt(process.argv[2]), parseInt(process.argv[3]), best.fitness);
    best.writeCSV(project.targetValues);
    console.log(best.rootExpression.getExpression());
}
function testaCombina() {
    let mate1 = new individual_1.Individual(["NUMBER", "NUMBER"], "NUMBER", parseInt(process.argv[2]));
    let mate2 = new individual_1.Individual(["NUMBER", "NUMBER"], "NUMBER", parseInt(process.argv[2]));
    let { s1, s2 } = Object.assign({}, mate1.combine(mate2));
    fs.writeFileSync(`report/mates.dot`, " digraph G20 {" + mate1.rootExpression.getDotToCombine() + s1.rootExpression.getDotToCombine() + mate2.rootExpression.getDotToCombine() + s2.rootExpression.getDotToCombine() + "}", "utf-8");
    [s1, s2, mate1, mate2].forEach(i => {
        let v = i.getValue({ x: 10 });
        console.log(v);
        if (v == 0 && false) {
            fs.writeFileSync("report/erro.json", stringify(i, { space: '  ' }), "utf-8");
            process.exit(1);
        }
    });
}
function testaGpNode() {
    //let fs = GPNode.generateFunctions() + "console.log(add(1, 3))";
    let node = new gp_node_1.GPNode("", "NUMBER", "return i0;", ["NUMBER"]);
    node.initChildren([new gp_node_1.GPNode("x", "EXTERNAL")], parseInt(process.argv[2]));
    console.log(node.getExpression());
    fs.writeFileSync("report/node.dot", node.getDot(), "utf-8");
    console.log(node.value({ x: 10 }));
}
//testaCombina();
testaProject();
//testaNodeExpression();
//testaIntegerInputLeaf();
//testaFloatConstantLeaf();
//testaIntegerConstantLeaf();
//# sourceMappingURL=index.js.map