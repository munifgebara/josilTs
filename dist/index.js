"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("./josilts/project");
function runProject1() {
    let project1 = new project_1.Project("serra", [{ name: "d", type: "NUMBER" }, { name: "w", type: "NUMBER" }], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project1.insertTargetValuesFromCSV("serra.csv");
    project1.evolveN(parseInt(process.argv[4]));
}
function runProject2() {
    let project2 = new project_1.Project("polinomial", [{ name: "x", type: "NUMBER" }], "NUMBER", parseInt(process.argv[2]), parseInt(process.argv[3]));
    project2.insertTargetValuesFromExpression("Math.cos(x)");
    project2.evolveN(parseInt(process.argv[4]));
}
runProject2();
//# sourceMappingURL=index.js.map