import * as fs from 'fs';
import { ExternalParameters } from './project';
import { Utils } from './utils';
import { GPNode } from './gp-node';
import { GPType, Support } from './support';

export class Individual {

    public static ID = 0;

    public id = ++Individual.ID;

    public rootExpression: GPNode;

    public fitness: number = -1;

    public value: any = null;

    constructor(public inputTypes: ExternalParameters[], public outputType: GPType, public maxHeigth: number, public nodes: GPNode[]) {
        this.rootExpression = new GPNode(``, "FUNCTION", this.outputType, "return i0;", [this.outputType], 0);

        this.rootExpression.initChildren(nodes, maxHeigth);
    }

    public calculateValue(input: any) {
        let v = this.rootExpression.value(input, this.nodes);
        if (isNaN(v)) {
            return 1000;
        }
        return v;
    }

    public writeCSV(name: string, targetValues: any[], header: boolean = false): void {
        let csv = "";
        if (header) {
            csv += `expressao,${this.rootExpression.getExpression()}\n`;
            csv += `parametros,${process.argv}\n`;
            csv += `i` + this.inputTypes.reduce((p, c) => p + "," + c.name, "") + `,output,pg,corretude\n`;

            targetValues.forEach((v, i) => {
                let value = this.calculateValue(v);
                csv += `${i + 1}${this.inputTypes.reduce((p, c) => p + ",    " + (v[c.name]), "")},${(v.output)},${(value)}} \n`;
            });
            fs.writeFileSync(`report/${name}.csv`, csv, "utf-8");
        }
    }

    public updateFitness(targetValues: any[]) {
        this.fitness = 0;
        targetValues.forEach(v => {
            let value = this.calculateValue(v);
            let dif = v.output - value;
            this.fitness += (dif * dif);
        });
    }


}

