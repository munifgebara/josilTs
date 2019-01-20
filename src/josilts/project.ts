import * as fs from 'fs';


import { Individual } from "./individual";
import { GPType } from './gp-node';


export interface TargetValue {
    x: number,
    f: number
}

export class Project {


    public population: Individual[];

    public targetValues: TargetValue[];

    constructor(public title: string, public inputType: GPType, public outputType: GPType, public populationSize: number = 100, public maxHeigth = 5) {
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            process.stdout.write("Create Population " + i + "/" + this.populationSize + "                                 \r");
            this.population.push(new Individual(this.inputType, this.outputType, 1 + i % this.maxHeigth));
        }
    }

    public getBest() {
        let best: Individual;
        this.population.forEach((ind, i) => {
            ind.updateFitness(this.targetValues)
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

