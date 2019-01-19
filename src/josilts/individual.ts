import * as fs from 'fs';
import { Leaf } from "./leaf";
import { NodeExpression } from "./node-expression";
import { FloatConstantLeaf } from "./float-costant-leaf";
import { FloatInputLeaf } from "./float-input-leaf";
import { Type, TreeNode } from "./tree-node";
import { TargetValue } from './project';
import { Utils } from './utils';
import { IntegerConstantLeaf } from './integer-costant-leaf';

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

    private cut(ind: TreeNode[]): { begin: TreeNode[], end: TreeNode[] } {
        let cutPoint = 1 + Math.floor(Math.random() * (ind.length - 1));
        return { begin: ind.slice(0, cutPoint), end: ind.slice(cutPoint) };
    }



    public combine(mate1: Individual): { s1: Individual, s2: Individual } {
        let s1 = new Individual(this.inputType, this.outputType, this.terminals, this.functions, 0);
        let s2 = new Individual(this.inputType, this.outputType, this.terminals, this.functions, 0);

        let m1R: NodeExpression = this.rootExpression.copy() as NodeExpression;
        let m2R: NodeExpression = mate1.rootExpression.copy() as NodeExpression;

        let mate1Array = m1R.getNodesAsArray();
        let mate2Array = m2R.getNodesAsArray();

        let { begin: mate1Begin, end: mate1End } = { ... this.cut(mate1Array) };
        let { begin: mate2Begin, end: mate2End } = { ... this.cut(mate2Array) };
        s1.rootExpression.children = [mate1Begin[1] as NodeExpression];
        s2.rootExpression.children = [mate2Begin[1] as NodeExpression];

        let s1re: NodeExpression[] = s1.rootExpression.getAllSubNodeExpressions();
        let s2re: NodeExpression[] = s2.rootExpression.getAllSubNodeExpressions();
        let a2 = s2re[Math.round(s2re.length / 2)];
        let a1 = s1re[Math.round(s1re.length / 2)];

        if (a1 && a2) s1re[Math.round(s1re.length / 2)].children[0] = a2.copy();
        if (a1 && a2) s2re[Math.round(s2re.length / 2)].children[0] = a1.copy();







        return { s1, s2 };
    }




}

