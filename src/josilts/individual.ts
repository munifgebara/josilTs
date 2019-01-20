import * as fs from 'fs';
import { TargetValue } from './project';
import { Utils } from './utils';
import { GPNode, GPType } from './gp-node';

export class Individual {

    public static ID = 0;

    public id = ++Individual.ID;

    public rootExpression: GPNode;

    public fitness: number = -1;

    constructor(public inputType: GPType, public outputType: GPType, public maxHeigth: number = 4) {
        this.rootExpression = new GPNode(``, "NUMBER", "return i0;", ["NUMBER"]);
        this.rootExpression.initChildren([new GPNode("x", "EXTERNAL")], maxHeigth);
    }

    public getValue(input: any) {
        return this.rootExpression.value(input);
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
        if (true) {
            this.fitness = 0;
            targetValues.forEach(v => {
                let dif = v.f - this.getValue({ x: v.x });
                this.fitness += (dif * dif);
            });
        }
    }



    public combine(other: Individual): { s1: Individual, s2: Individual } {
        let s1: Individual = new Individual(this.inputType, this.outputType, this.maxHeigth);
        s1.rootExpression = this.rootExpression.createCopy();
        let s2: Individual = new Individual(other.inputType, other.outputType, other.maxHeigth);
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



    /*
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
  
  
  
  
  
  
  
    */


}

