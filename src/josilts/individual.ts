import * as fs from 'fs';
import { Leaf } from "./leaf";
import { NodeExpression } from "./node-expression";
import { FloatConstantLeaf } from "./float-costant-leaf";
import { FloatInputLeaf } from "./float-input-leaf";
import { Type } from "./tree-node";
import { TargetValue } from './project';

export class Individual {

    public static ID = 0;

    public id: number = 0;

    public rootExpression: NodeExpression;

    public fitness: number = 0;

    constructor(public inputType: Type, public outputType: Type, public terminals: Leaf[], public functions: NodeExpression[], public maxHeigth: number = 4) {
        this.id = ++Individual.ID;
        this.rootExpression = new NodeExpression("I" + this.id, this.inputType, "return a0;", [this.outputType], this.terminals, this.functions, maxHeigth, 0);
    }

    public getValue(input: any) {
        return this.rootExpression.getValue(input);
    }

    public writeDot(): void {
        fs.writeFileSync(`report/i${this.id}.dot`, this.rootExpression.getDot(), "utf-8");
    }

    public writeCSV(targetValues: TargetValue[]): void {
        let csv = "";
        csv += `x,F,PG\n`;
        targetValues.forEach(v => {
            let value = this.getValue({ x: v.x });
            csv += `${v.x},${v.f},${value}\n`;
        });
        fs.writeFileSync(`report/i${this.id}.csv`, csv, "utf-8");
    }

    public updateFitness(targetValues: TargetValue[]) {
        this.fitness = 0;
        targetValues.forEach(v => {
            let dif = v.f - this.getValue({ x: v.x });
            this.fitness += (dif * dif);
        });
    }



}

