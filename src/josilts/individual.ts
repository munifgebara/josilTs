import * as fs from 'fs';
import { ExternalParameters } from './project';
import { Utils } from './utils';
import { GPNode, GPType } from './gp-node';

export class Individual {

    public static ID = 0;

    public id = ++Individual.ID;

    public rootExpression: GPNode;

    public fitness: number = -1;

    constructor(public inputTypes: ExternalParameters[], public outputType: GPType, public maxHeigth: number = 4) {
        this.rootExpression = new GPNode(``, "FUNCTION", this.outputType, "return i0;", [this.outputType]);
        let nodes:GPNode[]=[];
        inputTypes.forEach((c,i)=>nodes.push(new GPNode(c.name,"EXTERNAL",c.type)));
        this.rootExpression.initChildren(nodes, maxHeigth);
    }

    public getValue(input: any) {
        let v = this.rootExpression.value(input);
        return v;
    }

    public writeCSV(targetValues: any[]): void {
        let csv = "";
        csv += `expressao,${this.rootExpression.getExpression()}\n`;
        csv += `parametros,${process.argv}\n`;
        csv +=  `i`+this.inputTypes.reduce((p,c)=>p+","+c.name,"")+`,output,pg\n`;
        targetValues.forEach((v,i) => {
            let value = this.getValue(v);
            csv += `${i+1}${this.inputTypes.reduce((p,c)=>p+","+v[c.name],"")},${v.output},${value}\n`;
        });
        fs.writeFileSync(`report/best.csv`, csv, "utf-8");
    }

    public updateFitness(targetValues: any[]) {
        if (true) {
            this.fitness = 0;
            targetValues.forEach(v => {
                let value = this.getValue(v);
                let dif = v.output-value;
                this.fitness += (dif * dif);
            });
        }
    }



    public combine(other: Individual): { s1: Individual, s2: Individual } {
         let s1: Individual = new Individual(this.inputTypes, this.outputType, this.maxHeigth);
        // s1.rootExpression = this.rootExpression.createCopy();
         let s2: Individual = new Individual(other.inputTypes, other.outputType, other.maxHeigth);
        // s2.rootExpression = other.rootExpression.createCopy();

        // let s1fcs: GPNode[] = s1.rootExpression.getAllChildrenWithChildren();
        // let a1 = s1fcs[Utils.integerRandom(0, s1fcs.length - 1)];


        // let s2fcs: GPNode[] = s2.rootExpression.getAllChildrenWithChildren();
        // let a2 = s2fcs[Utils.integerRandom(0, s2fcs.length - 1)];


        // let i1 = Utils.integerRandom(0, a1.children.length - 1);
        // let i2 = Utils.integerRandom(0, a2.children.length - 1);

        // let aux: GPNode = a1.children[i1].createCopy();

        // a1.children[i1] = a2.children[i2].createCopy();
        // a2.children[i2] = aux;
        let {i1,i2}=GPNode.combine(this.rootExpression,other.rootExpression);
        s1.rootExpression=i1;
        s2.rootExpression=i2;



        return { s1, s2 };
    }





}

