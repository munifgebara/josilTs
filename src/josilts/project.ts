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

    constructor(public title: string,
        public externalParameters: ExternalParameters[],
        public outputType: GPType,
        public populationSize: number = 100,
        public maxHeigth = 5,
        public projectBasicNodes: GPNode[] = Support.getBasicMatematicalFunctions(),
        public population: Individual[] = [],
    ) {
        if (title == "_CLONE") return;
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        this.population = [];
        externalParameters.forEach((c, i) => this.projectBasicNodes.push(new GPNode(c.name, "EXTERNAL", c.type, ``, [], 0)));
        for (let i = population.length; i < this.populationSize; i++) {
            const n = new Individual(this.externalParameters, this.outputType, this.maxHeigth, this.projectBasicNodes);
            this.population.push(n);
            process.stdout.write("Creating Population " + (i + 1) + "/" + this.populationSize + "\r");
        }
        process.stdout.write("\n");
    }



    public updateAllFitness() {
        this.population.forEach(ind => ind.updateFitness(this.targetValues));
        this.population.sort((a, b) => a.fitness - b.fitness);
    }

    public evolve() {
        this.generation++;
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 0; i < metade; i += 2) {
            let j = metade + i;
            let r = Support.mixIndividuals(this.population[i], this.population[i + 1]);
            this.population[j] = r.s1;
            this.population[j + 1] = r.s2;
        }
        this.updateAllFitness();
        let summ = 0;
        this.population.forEach((ind, i) => { //TOCAR POR REDUCE
            if (!isNaN(ind.fitness)) {
                summ += ind.fitness / this.populationSize;
            }
        });
        let best = this.population[0];


        this.avgFit = Math.round(summ);
        process.stdout.write(`G:${this.generation} B:${best.id} BF:${best.fitness}  A:${this.avgFit} \r\n`);
        fs.writeFileSync(`report/${this.title}_best.dot`, best.rootExpression.getDot(best.rootExpression.getExpression()), "utf-8");

    }

    evolveN(generations: number) {
        this.updateAllFitness();
        let best = this.population[0];
        for (let ge = 0; ge < generations; ge++) {
            this.evolve();
            this.population[0].writeCSV(this.title, this.targetValues);
            if (ge % 10 == 0) {
                fs.writeFileSync(`bkp/${this.title}_BKP_project.json`, JSON.stringify(this, null, 2), "utf8");
            }
        }
        Support.writeSVGToDisk(`report/${this.title}_best.svg`, best.rootExpression.getDot());
        console.log(`Fitness ${best.fitness}`);
        console.log(best.rootExpression.getExpression());
    }

}

