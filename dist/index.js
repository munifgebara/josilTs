"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const stringify = require("json-stable-stringify");
const project_1 = require("./josilts/project");
const individual_1 = require("./josilts/individual");
function testaProject() {
    let project = new project_1.Project("f2", ["NUMBER", "NUMBER"], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    let serra = project_1.Project.readSVG("serra.csv");
    serra.forEach(s => {
        project.targetValues.push({ input: [s.d, s.w], output: s.p });
    });
    let best = project.population[0];
    for (let ge = 0; ge <= parseInt(process.argv[4]); ge++) {
        process.stdout.write("                                                                           Offspring " + ge + " " + project.avgFit + "\r");
        best = project.getBest();
        best.writeCSV(project.targetValues);
        project.evolve();
    }
    project_1.Project.writeSVGToDisk(`report/best.svg`, best.rootExpression.getDot());
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
testaProject();
//# sourceMappingURL=index.js.map