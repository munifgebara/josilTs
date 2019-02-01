"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("../josilts/project");
const support_1 = require("../josilts/support");
const gp_node_1 = require("../josilts/gp-node");
const individual_1 = require("../josilts/individual");
class GameProject extends project_1.Project {
    constructor(title = "new_game_project", externalParameters = [{ name: "x", type: "NUMBER" }], outputType = "NUMBER", populationSize = 100, maxHeigth = 5, projectBasicNodes = support_1.Support.getBasicMatematicalFunctions(), population = []) {
        super();
        this.title = title;
        this.externalParameters = externalParameters;
        this.outputType = outputType;
        this.populationSize = populationSize;
        this.maxHeigth = maxHeigth;
        this.projectBasicNodes = projectBasicNodes;
        this.population = population;
        if (title == "_CLONE")
            return;
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        externalParameters.forEach((c, i) => this.projectBasicNodes.push(new gp_node_1.GPNode(c.name, "EXTERNAL", c.type, ``, [], 0)));
        for (let i = population.length; i < this.populationSize; i++) {
            const n = new individual_1.Individual(this.externalParameters, this.outputType, 3 + (i % (this.maxHeigth - 2)), this.projectBasicNodes);
            this.population.push(n);
            process.stdout.write("Creating Population " + (i + 1) + "/" + this.populationSize + "\r");
        }
        process.stdout.write("\n");
    }
}
exports.GameProject = GameProject;
//# sourceMappingURL=game-project.js.map