import * as fs from 'fs';


import { Individual } from "./individual";
import { GPType } from './gp-node';


export interface TargetValue {
    input: number[],
    output: number
}

export class Project {


    public population: Individual[];

    public targetValues: TargetValue[];

    public avgFit = 0;

    constructor(public title: string, public inputTypes: GPType[], public outputType: GPType, public populationSize: number = 100, public maxHeigth = 5) {
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            process.stdout.write("Create Population " + i + "/" + this.populationSize + "                                 \r");
            this.population.push(new Individual(this.inputTypes, this.outputType, this.maxHeigth));
        }
    }

    public getBest() {
        let best: Individual;
        let summ = 0;
        this.population.forEach((ind, i) => {
            ind.updateFitness(this.targetValues);
            summ += ind.fitness / this.populationSize;
            if (i == 0 || ind.fitness < best.fitness) {
                best = ind;
                process.stdout.write("Best fit " + i + " " + Math.round(ind.fitness) + "  \r");
                fs.writeFileSync(`report/best.dot`, best.rootExpression.getDot(), "utf-8");
            }
            if (i % 1000 == 0) {
                process.stdout.write("Best fit " + i + " " + Math.round(best.fitness) + " ID:" + best.id + "  \r");
            }
        });
        process.stdout.write("\n");
        this.avgFit = Math.round(summ);
        return best;
    }

    public evolve() {
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

