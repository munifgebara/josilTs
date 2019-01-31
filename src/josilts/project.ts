import * as fs from 'fs';
import { Individual } from "./individual";
import { Utils } from './utils';
import { GPType, Support } from './support';
import { GPNode } from './gp-node';


export interface ExternalParameters {
    name: string,
    type: GPType
}


export class Project {
    public lastEvolve: string = "";

    public static getInstance(data: any): Project {
        let newInstance = new Project("_CLONE", data.externalParameters, data.outputType);
        Object.assign(newInstance, data);
        newInstance.population = [];
        data.population.forEach(ind => newInstance.population.push(Individual.getInstance(ind)));

        newInstance.projectBasicNodes = [];
        data.projectBasicNodes.forEach(node => newInstance.projectBasicNodes.push(GPNode.getInstance(node)));

        return newInstance;
    }


    public targetValues: any[];

    public avgFit = 0;

    public generation = 0;

    public repeat = 0;

    constructor(public title: string = "new_project",
        public externalParameters: ExternalParameters[] = [{ name: "x", type: "NUMBER" }],
        public outputType: GPType = "NUMBER",
        public populationSize: number = 100,
        public maxHeigth = 5,
        public projectBasicNodes: GPNode[] = Support.getBasicMatematicalFunctions(),
        public population: Individual[] = [],
    ) {
        if (title == "_CLONE") return;
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];

        externalParameters.forEach((c, i) => this.projectBasicNodes.push(new GPNode(c.name, "EXTERNAL", c.type, ``, [], 0)));
        for (let i = population.length; i < this.populationSize; i++) {
            const n = new Individual(this.externalParameters, this.outputType, 3 + (i % (this.maxHeigth - 2)), this.projectBasicNodes);
            this.population.push(n);
            process.stdout.write("Creating Population " + (i + 1) + "/" + this.populationSize + "\r");
        }
        process.stdout.write("\n");
    }

    public simplifyAll() {
        this.population.forEach(ind => ind.rootExpression.children[0].deepSimplify());
    }

    public updateAllFitness() {

        this.population.forEach(ind => ind.updateFitness(this.targetValues));
        this.population.sort((a, b) => a.fitness - b.fitness);
    }

    public evolveWithBest(inicial: number = 1, extra: string = "") {
        console.log("Evolve with best");
        const s = process.hrtime();
        this.generation++;
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 1; i < this.populationSize - 1; i += 2) {
            let r = Support.mixIndividuals(this.population[0], this.population[i]);
            this.population[i] = r.s1;
            this.population[i + 2] = r.s2;
        }
        this.updateAllFitness();
        let summ = 0;
        this.population.forEach((ind, i) => { //TOCAR POR REDUCE
            if (!isNaN(ind.fitness)) {
                summ += ind.fitness / this.populationSize;
            }
        });
        let best = this.population[0];


        this.avgFit = Utils.round(summ);
        let exp = Support.getSimpleExpression(best.rootExpression.createCopy().deepSimplify());
        exp = Utils.replaceAll(exp, "Math.", "");
        process.stdout.write(`G:${this.generation} B:${best.id} BF:${best.fitness.toFixed(3)}  ${extra}  A:${this.avgFit.toFixed(3)} EXP:${Utils.resume(exp, 120)}  \r\n`);
        fs.writeFileSync(`report/${this.title}_best.dot`, best.rootExpression.getDot(best.rootExpression.getExpression()), "utf-8");
        const e = process.hrtime(s);
        this.lastEvolve = (e[0] + e[1] / 1e9).toFixed(3);

    }

    public evolve(extra: string = "") {
        const s = process.hrtime();
        this.generation++;
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 0; i < metade; i += 2) {
            let j = metade + i;
            let r = Support.mixIndividuals(this.population[i], this.population[i + 1]);
            this.population[j] = r.s1;
            this.population[j + 1] = r.s2;
        }
        //this.simplifyAll();
        this.updateAllFitness();
        let summ = 0;
        this.population.forEach((ind, i) => { //TOCAR POR REDUCE
            if (!isNaN(ind.fitness)) {
                summ += ind.fitness / this.populationSize;
            }
        });
        let best = this.population[0];


        this.avgFit = Utils.round(summ);
        let exp = Support.getSimpleExpression(best.rootExpression.createCopy().deepSimplify());
        exp = Utils.replaceAll(exp, "Math.", "");
        process.stdout.write(`G:${this.generation} B:${best.id} BF:${best.fitness.toFixed(3)}  ${extra}  A:${this.avgFit.toFixed(3)}  \r`);
        fs.writeFileSync(`report/${this.title}_best.dot`, best.rootExpression.getDot(best.rootExpression.getExpression()), "utf-8");
        const e = process.hrtime(s);
        this.lastEvolve = (e[0] + e[1] / 1e9).toFixed(3);

    }

    evolveN(generations: number, minFitnes: number = -0.1) {
        const start = process.hrtime();
        this.updateAllFitness();
        let af = 10000;
        for (let ge = 0; ge < generations; ge++) {
            const tnow = process.hrtime(start);
            const telapsed = (tnow[0] + tnow[1] / 1e9);;

            this.evolve(` Time:${telapsed.toFixed(3)}s ${((1 + ge) * this.populationSize / telapsed).toFixed(3)}ind/s EvolveTime:${this.lastEvolve}s`);
            if (this.population[0].fitness < af) {
                this.population[0].writeCSV(this.title, this.targetValues);
                fs.writeFileSync(`bkp/${this.title}_BKP_best.json`, JSON.stringify(this.population[0], null, 2), "utf8");
                if (this.population[0].fitness < minFitnes) break;
                fs.writeFileSync(`pop/${this.title}_${this.generation}.dot`, this.getPopulationAsDot());
                af = this.population[0].fitness;
                console.log("");
            }
        }
        Support.writeSVGToDisk(`report/${this.title} _best.svg`, this.population[0].rootExpression.getDot());
        console.log(`Fitness ${this.population[0].fitness} `);
        fs.writeFileSync(`report/${this.title} _best.js`, Utils.replaceAll(Support.getSimpleExpression(this.population[0].rootExpression.createCopy().deepSimplify()), "externals['x']", "x") + "\n" + this.population[0].rootExpression.getExpression() + "\n" + this.population[0].rootExpression.getFunction());
        const end = process.hrtime(start);
        const elapsed = (end[0] + end[1] / 1e9).toFixed(3);
        console.log(elapsed, "s");
    }

    getPopulationAsDot(): string {

        let dot = `digraph Population_${this.generation} {\n`;
        this.population.forEach(i => {
            dot += i.rootExpression.getDotToCombine() + "\n";
        })
        dot += "}\n";
        return dot;

    }

}

