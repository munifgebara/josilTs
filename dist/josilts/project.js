"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const individual_1 = require("./individual");
class Project {
    constructor(title, inputType, outputType, populationSize = 100, maxHeigth = 5) {
        this.title = title;
        this.inputType = inputType;
        this.outputType = outputType;
        this.populationSize = populationSize;
        this.maxHeigth = maxHeigth;
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            process.stdout.write("Create Population " + i + "/" + this.populationSize + "                                 \r");
            this.population.push(new individual_1.Individual(this.inputType, this.outputType, 1 + i % this.maxHeigth));
        }
    }
    getBest() {
        let best;
        this.population.forEach((ind, i) => {
            ind.updateFitness(this.targetValues);
            if (i == 0 || ind.fitness < best.fitness) {
                best = ind;
                process.stdout.write("Best fit " + i + " " + ind.fitness + "                            \r");
                fs.writeFileSync(`report/best.dot`, best.rootExpression.getDot(), "utf-8");
            }
            if (i % 100 == 0) {
                process.stdout.write("Best fit " + i + " " + best.fitness + "                                 \r");
            }
        });
        process.stdout.write("\n");
        return best;
    }
    evolve() {
        this.population.sort((a, b) => a.fitness - b.fitness);
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 0; i < metade; i += 2) {
            let j = metade + i;
            let r = this.population[i].combine(this.population[i + 1]);
            this.population[j] = r.s1;
            this.population[j + 1] = r.s2;
        }
    }
}
exports.Project = Project;
//# sourceMappingURL=project.js.map