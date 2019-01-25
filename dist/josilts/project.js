"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const individual_1 = require("./individual");
const support_1 = require("./support");
const gp_node_1 = require("./gp-node");
class Project {
    constructor(title, externalParameters, outputType, populationSize = 100, maxHeigth = 5, projectBasicNodes = support_1.Support.getBasicMatematicalFunctions(), population = []) {
        this.title = title;
        this.externalParameters = externalParameters;
        this.outputType = outputType;
        this.populationSize = populationSize;
        this.maxHeigth = maxHeigth;
        this.projectBasicNodes = projectBasicNodes;
        this.population = population;
        this.avgFit = 0;
        this.generation = 0;
        this.repeat = 0;
        if (title == "_CLONE")
            return;
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        this.population = [];
        externalParameters.forEach((c, i) => this.projectBasicNodes.push(new gp_node_1.GPNode(c.name, "EXTERNAL", c.type, ``, [], 0)));
        for (let i = population.length; i < this.populationSize; i++) {
            const n = new individual_1.Individual(this.externalParameters, this.outputType, this.maxHeigth, this.projectBasicNodes);
            this.population.push(n);
            process.stdout.write("Creating Population " + (i + 1) + "/" + this.populationSize + "\r");
        }
        process.stdout.write("\n");
    }
    static getInstance(data) {
        let newInstance = new Project("_CLONE", data.externalParameters, data.outputType);
        Object.assign(newInstance, data);
        newInstance.population = [];
        data.population.forEach(ind => newInstance.population.push(individual_1.Individual.getInstance(ind)));
        newInstance.projectBasicNodes = [];
        data.projectBasicNodes.forEach(node => newInstance.projectBasicNodes.push(gp_node_1.GPNode.getInstance(node)));
        return newInstance;
    }
    updateAllFitness() {
        this.population.forEach(ind => ind.updateFitness(this.targetValues));
        this.population.sort((a, b) => a.fitness - b.fitness);
    }
    evolve() {
        this.generation++;
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 0; i < metade; i += 2) {
            let j = metade + i;
            let r = support_1.Support.mixIndividuals(this.population[i], this.population[i + 1]);
            this.population[j] = r.s1;
            this.population[j + 1] = r.s2;
        }
        this.updateAllFitness();
        let summ = 0;
        this.population.forEach((ind, i) => {
            if (!isNaN(ind.fitness)) {
                summ += ind.fitness / this.populationSize;
            }
        });
        let best = this.population[0];
        this.avgFit = Math.round(summ);
        process.stdout.write(`G:${this.generation} B:${best.id} BF:${best.fitness}  A:${this.avgFit} \r\n`);
        fs.writeFileSync(`report/${this.title}_best.dot`, best.rootExpression.getDot(best.rootExpression.getExpression()), "utf-8");
    }
    evolveN(generations) {
        this.updateAllFitness();
        let best = this.population[0];
        for (let ge = 0; ge < generations; ge++) {
            this.evolve();
            this.population[0].writeCSV(this.title, this.targetValues);
        }
        support_1.Support.writeSVGToDisk(`report/${this.title}_best.svg`, best.rootExpression.getDot());
        console.log(`Fitness ${best.fitness}`);
        console.log(best.rootExpression.getExpression());
    }
}
exports.Project = Project;
//# sourceMappingURL=project.js.map