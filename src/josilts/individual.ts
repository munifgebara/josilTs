import * as fs from 'fs';
import { TargetValue } from './project';
import { Utils } from './utils';
import { GPNode, GPType } from './gp-node';

export class Individual {

    public static ID = 0;

    public id = ++Individual.ID;

    public rootExpression: GPNode;

    public fitness: number = -1;

    constructor(public inputTypes: GPType[], public outputType: GPType, public maxHeigth: number = 4) {
        this.rootExpression = new GPNode(``, this.outputType, "return i0;", [this.outputType]);
        this.rootExpression.initChildren([new GPNode("d", "EXTERNAL"), new GPNode("w", "EXTERNAL")], maxHeigth);
    }

    public getValue(input: any) {
        let v = this.rootExpression.value(input);
        return v;
    }

    public writeCSV(targetValues: TargetValue[]): void {
        let csv = "";
        csv += `expressao,${this.rootExpression.getExpression()}\n`;
        csv += `parametros,${process.argv}\n`;
        csv += `d,w,p,pg,distance\n`;
        targetValues.forEach(v => {
            let value = this.getValue({ d: v.input[0], w: v.input[1] });
            csv += `${v.input[0]},${v.input[1]},${v.output},${Math.round((value < 0 ? 0 : value))},${Math.abs(Math.round(v.output - (value < 0 ? 0 : value)))}\n`;
        });
        fs.writeFileSync(`report/best.csv`, csv, "utf-8");
    }

    public updateFitness(targetValues: TargetValue[]) {
        if (true) {
            this.fitness = 0;
            targetValues.forEach(v => {
                let value = this.getValue({ d: v.input[0], w: v.input[1] });
                let dif = v.output - (value < 0 ? 0 : value);
                this.fitness += (dif * dif);
            });
        }
    }



    public combine(other: Individual): { s1: Individual, s2: Individual } {
        let s1: Individual = new Individual(this.inputTypes, this.outputType, this.maxHeigth);
        s1.rootExpression = this.rootExpression.createCopy();
        let s2: Individual = new Individual(other.inputTypes, other.outputType, other.maxHeigth);
        s2.rootExpression = other.rootExpression.createCopy();

        let s1fcs: GPNode[] = s1.rootExpression.getAllFunctions();
        let a1 = s1fcs[Utils.integerRandom(0, s1fcs.length - 1)];


        let s2fcs: GPNode[] = s2.rootExpression.getAllFunctions();
        let a2 = s2fcs[Utils.integerRandom(0, s2fcs.length - 1)];


        let i1 = Utils.integerRandom(0, a1.children.length - 1);
        let i2 = Utils.integerRandom(0, a2.children.length - 1);

        let aux: GPNode = a1.children[i1].createCopy();

        a1.children[i1] = a2.children[i2].createCopy();
        a2.children[i2] = aux;



        return { s1, s2 };
    }





}

