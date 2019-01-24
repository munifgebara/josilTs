import * as fs from 'fs';

const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');

import { Individual } from "./individual";
import { GPType } from './gp-node';



export interface ExternalParameters {
    name: string,
    type: GPType
}


export class Project {

    public static viz = new Viz({ Module, render });

    public static tenArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


    public static writeSVGToDisk(fileName: string, dot: string) {

        Project.viz.renderString(dot)
            .then(result => {
                fs.writeFileSync(fileName, result, "utf-8");
            })
            .catch(error => {
                Project.viz = new Viz({ Module, render })
                console.error("ERROR:" + error + "\n");
            });
    }


    public targetValues: any[];

    public avgFit = 0;

    public generation=0;

    constructor(public title: string, public externalParameters: ExternalParameters[], public outputType: GPType, public populationSize: number = 100, public maxHeigth = 5, public population: Individual[] = []) {
        console.log(this.title, this.populationSize, this.maxHeigth);
        this.targetValues = [];
        this.population = [];
        for (let i = population.length; i < this.populationSize; i++) {
            this.population.push(new Individual(this.externalParameters, this.outputType,  this.maxHeigth));
            process.stdout.write("Create Population " + (i+1) + "/" + this.populationSize + "\r");
        }
        console.log("");
    }

    public getBest() {
        
        let ctv2 = this.targetValues[Math.round(this.targetValues.length)/2];
        let external2 = ctv2;
        let best: Individual;        
        let summ = 0;
        this.population.forEach((ind, i) => {
            ind.updateFitness(this.targetValues);
            summ += ind.fitness / this.populationSize;
            if (i==0 || ind.fitness < best.fitness) {
                best = ind;
                process.stdout.write(`${this.generation} ${best.id} ${Math.round(best.fitness)} ` +                    
                `${JSON.stringify(external2)}=>${Math.round(best.rootExpression.value(external2))} ` +                    
                  ` \r`);
                fs.writeFileSync(`report/best.dot`, best.rootExpression.getDot(best.rootExpression.getExpression()), "utf-8");
            }
        });
        
        
        this.avgFit = Math.round(summ);
        process.stdout.write(`${this.generation} ${best.id} ${Math.round(best.fitness)} ` +                    
        `${JSON.stringify(external2)}=>${Math.round(best.rootExpression.value(external2))} ` +                    
          `${summ} \r\n`);
        return best;
    }

    public evolve() {
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

    public static readCSV(name: string): any[] {
        let l = [];
        let data = fs.readFileSync(name).toString().split("\r\n");
        let fields = data[0].split(",");
        for (let i = 1; i < data.length; i++) {
            let row = data[i].split(",");
            let obj = fields.reduce((p: any, c: string, ind) => {
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


}

