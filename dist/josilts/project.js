"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');
const individual_1 = require("./individual");
const utils_1 = require("./utils");
class Project {
    constructor(title, externalParameters, outputType, populationSize = 100, maxHeigth = 5, population = []) {
        this.title = title;
        this.externalParameters = externalParameters;
        this.outputType = outputType;
        this.populationSize = populationSize;
        this.maxHeigth = maxHeigth;
        this.population = population;
        this.avgFit = 0;
        this.generation = 0;
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        this.population = [];
        for (let i = population.length; i < this.populationSize; i++) {
            this.population.push(new individual_1.Individual(this.externalParameters, this.outputType, this.maxHeigth));
            process.stdout.write("Create Population " + (i + 1) + "/" + this.populationSize + "\r");
        }
        console.log("");
    }
    static mutate(gpFunction5) {
        let pt = gpFunction5;
        let h = 0;
        while (pt.children.length > 0) {
            let pi = utils_1.Utils.indexRandom(pt.children);
            let prox = pt.children[pi];
            if (prox.children.length > 0 && pt.returnType == prox.returnType && pt.children.length == prox.children.length) {
                [prox.name, prox.code, pt.name, pt.code] = [pt.name, pt.code, prox.name, prox.code];
            }
            pt = pt.children[pi];
            h++;
        }
    }
    static writeSVGToDisk(fileName, dot) {
        Project.viz.renderString(dot)
            .then(result => {
            fs.writeFileSync(fileName, result, "utf-8");
        })
            .catch(error => {
            Project.viz = new Viz({ Module, render });
            console.error("ERROR:" + error + "\n");
        });
    }
    getBest() {
        let ctv2 = this.targetValues[Math.round(this.targetValues.length / 2)];
        let external2 = ctv2;
        let best;
        let summ = 0;
        this.population.forEach((ind, i) => {
            ind.updateFitness(this.targetValues);
            summ += ind.fitness / this.populationSize;
            if (i == 0 || ind.fitness < best.fitness) {
                best = ind;
                process.stdout.write(`${this.generation} ${best.id} ${Math.round(best.fitness)} ` +
                    `${JSON.stringify(external2)}=>${Math.round(best.rootExpression.value(external2))} ` +
                    `${summ} \r\n`);
                fs.writeFileSync(`report/best.dot`, best.rootExpression.getDot(best.rootExpression.getExpression()), "utf-8");
            }
        });
        this.avgFit = Math.round(summ);
        process.stdout.write(`${this.generation} ${best.id} ${Math.round(best.fitness)} ` +
            `${JSON.stringify(external2)}=>${Math.round(best.rootExpression.value(external2))} ` +
            `${summ} \r\n`);
        return best;
    }
    evolve() {
        this.generation++;
        this.population.sort((a, b) => a.fitness - b.fitness);
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 0; i < metade; i += 2) {
            let j = metade + i;
            let r = this.population[i].combine(this.population[i + 1]);
            this.population[j] = r.s1;
            this.population[j + 1] = r.s2;
        }
    }
    static readCSV(name) {
        let l = [];
        let data = fs.readFileSync(name).toString().split("\r\n");
        let fields = data[0].split(",");
        for (let i = 1; i < data.length; i++) {
            let row = data[i].split(",");
            let obj = fields.reduce((p, c, ind) => {
                p[c] = parseInt(row[ind]);
                return p;
            }, { index: i });
            if (obj[fields[0]]) {
                l.push(obj);
            }
        }
        console.log(`${l.length} rows imported`);
        return l;
    }
    insertTargetValuesFromCSV(filename) {
        this.targetValues = [];
        let serra = Project.readCSV(filename);
        serra.forEach(s => {
            this.targetValues.push(s);
        });
    }
    insertTargetValuesFromExpression(expression) {
        this.targetValues = [];
        for (let x = -4; x <= 5; x += 0.1) {
            let targetValue = { output: utils_1.Utils.round(eval(expression)) };
            this.externalParameters.forEach(ep => { targetValue[ep.name] = utils_1.Utils.round(x); });
            this.targetValues.push(targetValue);
        }
        ;
    }
    evolveN(generations) {
        let best = this.population[0];
        for (let ge = 0; ge <= generations; ge++) {
            best = this.getBest();
            best.writeCSV(this.title, this.targetValues);
            this.evolve();
        }
        Project.writeSVGToDisk(`report/${this.title}_best.svg`, best.rootExpression.getDot());
        console.log(parseInt(process.argv[2]), parseInt(process.argv[3]), best.fitness);
        best.writeCSV(this.title, this.targetValues);
    }
}
Project.viz = new Viz({ Module, render });
Project.tenArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
exports.Project = Project;
//# sourceMappingURL=project.js.map