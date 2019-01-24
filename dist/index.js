"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("./josilts/project");
function runProject() {
    let project = new project_1.Project("serra", [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    let serra = project_1.Project.readCSV("serra.csv");
    serra.forEach(s => {
        project.targetValues.push(s);
    });
    //  Project.tenArray.forEach(x => {
    //          project.targetValues.push({ x,  output: x*x-4*x+4 });
    //  });
    let best = project.population[0];
    for (let ge = 0; ge <= parseInt(process.argv[4]); ge++) {
        best = project.getBest();
        best.writeCSV(project.targetValues);
        project.evolve();
    }
    project_1.Project.writeSVGToDisk(`report/best.svg`, best.rootExpression.getDot());
    console.log(parseInt(process.argv[2]), parseInt(process.argv[3]), best.fitness);
    best.writeCSV(project.targetValues);
    console.log(best.rootExpression.height());
}
runProject();
//# sourceMappingURL=index.js.map