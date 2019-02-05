"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const individual_1 = require("./individual");
const utils_1 = require("./utils");
const support_1 = require("./support");
const gp_node_1 = require("./gp-node");
class Project {
    constructor(title = "new_project", externalParameters = [{ name: "x", type: "NUMBER" }], outputType = "NUMBER", populationSize = 100, maxHeigth = 5, projectBasicNodes = support_1.Support.getBasicMatematicalFunctions(), population = []) {
        this.title = title;
        this.externalParameters = externalParameters;
        this.outputType = outputType;
        this.populationSize = populationSize;
        this.maxHeigth = maxHeigth;
        this.projectBasicNodes = projectBasicNodes;
        this.population = population;
        this.lastEvolve = "";
        this.avgFit = 0;
        this.generation = 0;
        this.repeat = 0;
        if (title == "_CLONE")
            return;
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        externalParameters.forEach((c, i) => this.projectBasicNodes.push(new gp_node_1.GPNode(c.name, "EXTERNAL", c.type, ``, [], 0)));
        for (let i = population.length; i < this.populationSize; i++) {
            //const n = new Individual(this.externalParameters, this.outputType, 3 + (i % (this.maxHeigth - 2)), this.projectBasicNodes);
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
    simplifyAll() {
        this.population.forEach(ind => ind.rootExpression.children[0].deepSimplify());
    }
    updateAllFitness() {
        if (!this.specialFitness) {
            this.population.forEach((ind, i) => {
                ind.updateFitness(this.targetValues);
                process.stdout.write(`G:${this.generation} updating fitness ${i}  \r`);
            });
        }
        else {
            this.specialFitness(this.population);
        }
        this.population.sort((a, b) => a.fitness - b.fitness);
    }
    evolveWithBest(inicial = 1, extra = "") {
        console.log("Evolve with best");
        const s = process.hrtime();
        this.generation++;
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 1; i < this.populationSize - 1; i += 2) {
            let r = support_1.Support.mixIndividuals(this.population[0], this.population[i]);
            this.population[i] = r.s1;
            this.population[i + 2] = r.s2;
        }
        this.updateAllFitness();
        let summ = 0;
        this.population.forEach((ind, i) => {
            if (!isNaN(ind.fitness)) {
                summ += ind.fitness / this.populationSize;
            }
        });
        let best = this.population[0];
        this.avgFit = utils_1.Utils.round(summ);
        let exp = support_1.Support.getSimpleExpression(best.rootExpression.createCopy().deepSimplify());
        exp = utils_1.Utils.replaceAll(exp, "Math.", "");
        process.stdout.write(`G:${this.generation} B:${best.id} BF:${best.fitness.toFixed(3)}  ${extra}  A:${this.avgFit.toFixed(3)} EXP:${utils_1.Utils.resume(exp, 120)}  \r\n`);
        fs.writeFileSync(`report/${this.title}_best.dot`, best.rootExpression.getDot(best.rootExpression.getExpression()), "utf-8");
        const e = process.hrtime(s);
        this.lastEvolve = (e[0] + e[1] / 1e9).toFixed(3);
    }
    evolve(extra = "") {
        const s = process.hrtime();
        this.generation++;
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 0; i < metade; i += 2) {
            let j = metade + i;
            let r = support_1.Support.mixIndividuals(this.population[i], this.population[i + 1]);
            r.s1.rootExpression.deepSimplify();
            r.s2.rootExpression.deepSimplify();
            r.s1.rootExpression.deepSimplify();
            r.s2.rootExpression.deepSimplify();
            r.s1.rootExpression.deepSimplify();
            r.s2.rootExpression.deepSimplify();
            this.population[j] = r.s1;
            this.population[j + 1] = r.s2;
            process.stdout.write(`G:${this.generation} mixIndividuals ${i}  \r`);
        }
        //this.simplifyAll();
        this.updateAllFitness();
        let summ = 0;
        this.population.forEach((ind, i) => {
            if (!isNaN(ind.fitness)) {
                summ += ind.fitness / this.populationSize;
            }
        });
        let best = this.population[0];
        this.avgFit = utils_1.Utils.round(summ);
        let exp = support_1.Support.getSimpleExpression(best.rootExpression.createCopy().deepSimplify());
        exp = utils_1.Utils.replaceAll(exp, "Math.", "");
        process.stdout.write(`G:${this.generation} B:${best.id} BF:${best.fitness.toFixed(3)}  ${extra}  A:${this.avgFit.toFixed(3)}  \r`);
        fs.writeFileSync(`report/${this.title}_best.dot`, best.rootExpression.getDot(best.rootExpression.getExpression()), "utf-8");
        const e = process.hrtime(s);
        this.lastEvolve = (e[0] + e[1] / 1e9).toFixed(3);
    }
    evolveN(generations, minFitnes = -0.1) {
        const start = process.hrtime();
        this.updateAllFitness();
        let af = 10000;
        this.population[0].writeCSV(this.title, this.targetValues);
        for (let ge = 0; ge < generations; ge++) {
            const tnow = process.hrtime(start);
            const telapsed = (tnow[0] + tnow[1] / 1e9);
            ;
            this.evolve(` Time:${telapsed.toFixed(3)}s ${((1 + ge) * this.populationSize / telapsed).toFixed(3)}ind/s EvolveTime:${this.lastEvolve}s`);
            if (this.population[0].fitness < af) {
                this.population[0].writeCSV(this.title, this.targetValues);
                fs.writeFileSync(`bkp/${this.title}_BKP_best.json`, JSON.stringify(this.population[0], null, 2), "utf8");
                if (this.population[0].fitness < minFitnes)
                    break;
                fs.writeFileSync(`pop/${this.title}_${this.generation}.dot`, this.getPopulationAsDot());
                af = this.population[0].fitness;
                console.log("");
            }
        }
        support_1.Support.writeSVGToDisk(`report/${this.title} _best.svg`, this.population[0].rootExpression.getDot());
        console.log(`Fitness ${this.population[0].fitness} `);
        fs.writeFileSync(`report/${this.title} _best.js`, utils_1.Utils.replaceAll(support_1.Support.getSimpleExpression(this.population[0].rootExpression.createCopy().deepSimplify()), "externals['x']", "x") + "\n" + this.population[0].rootExpression.getExpression() + "\n" + this.population[0].rootExpression.getFunction());
        const end = process.hrtime(start);
        const elapsed = (end[0] + end[1] / 1e9).toFixed(3);
        console.log(elapsed, "s");
    }
    getPopulationAsDot() {
        let dot = `digraph Population_${this.generation} {\n`;
        for (let n = 0; n < (this.populationSize < 4 ? this.populationSize : 4); n++) {
            dot += this.population[n].rootExpression.getDotToCombine() + "\n";
        }
        dot += "}\n";
        return dot;
    }
}
exports.Project = Project;
//# sourceMappingURL=project.js.map