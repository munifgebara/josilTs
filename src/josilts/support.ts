import * as fs from 'fs';

const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');


import { GPNode } from "./gp-node";
import { Utils } from "./utils";
import { Individual } from "./individual";
import { ExternalParameters } from './project';

export type GPType = "NUMBER" | "BOOLEAN" | "STRING";
export type GPBehavior = "CONSTANT" | "EXTERNAL" | "FUNCTION";


export class Support {
    static createExternalParametersFromTargetValues(csv: any[]): ExternalParameters[] {
        let fields: string[] = Object.keys(csv[0]);
        return fields.filter(f => f != "index" && f != "output").reduce((p: ExternalParameters[], c: string) => [...p, { name: c, type: "NUMBER" } as ExternalParameters], []);
    }

    public static tenArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    static getConstantNode(type: GPType): GPNode {
        const toReturn = new GPNode(type + " Constant", "CONSTANT", type, ``, [], 0);
        switch (type) {
            case "BOOLEAN": toReturn.code = "" + (Utils.random() > 0.5);
                break;
            case "NUMBER": toReturn.code = "" + Utils.random();
                break;
            case "STRING": toReturn.code = "String";
                break;
        }
        return toReturn;
    }

    public static getConstantNodes(quantity: number, type: GPType = "NUMBER"): GPNode[] {
        let toReturn: GPNode[] = [];
        for (let i = 0; i < quantity; i++) {
            toReturn.push(Support.getConstantNode(type));
        }
        return toReturn;
    }

    public static getBasicMatematicalFunctions(): GPNode[] {
        let toReturn: GPNode[] = [];
        toReturn.push(new GPNode("add", "FUNCTION", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"], 0, "(i0+i1)"));
        toReturn.push(new GPNode("sub", "FUNCTION", "NUMBER", "return i0-i1;", ["NUMBER", "NUMBER"], 0, "(i0-i1)"));
        toReturn.push(new GPNode("mul", "FUNCTION", "NUMBER", "return i0*i1;", ["NUMBER", "NUMBER"], 0, "(i0*i1)"));
        toReturn.push(new GPNode("div", "FUNCTION", "NUMBER", "return i1==0?1:i0/i1;", ["NUMBER", "NUMBER"], 0, "(i1==0?1:i0/i1)"));
        toReturn.push(new GPNode("mod", "FUNCTION", "NUMBER", "return i1==0?i0:i0%i1;", ["NUMBER", "NUMBER"], 0, "(i1==0?i0:i0%i1)"));
        return toReturn;
    }

    public static getLogicalFunctions(): GPNode[] {
        let toReturn: GPNode[] = [];
        toReturn.push(new GPNode("and", "FUNCTION", "BOOLEAN", "return i0&&i1;", ["BOOLEAN", "BOOLEAN"], 0, "(i0&&i1)"));
        toReturn.push(new GPNode("or", "FUNCTION", "BOOLEAN", "return i0||i1;", ["BOOLEAN", "BOOLEAN"], 0, "(i0||i1)"));
        toReturn.push(new GPNode("not", "FUNCTION", "BOOLEAN", "return !i0;", ["BOOLEAN"], 0, "(!i0)"));
        toReturn.push(new GPNode("ifthenelse", "FUNCTION", "NUMBER", "return i0?i1:i2;", ["BOOLEAN", "NUMBER", "NUMBER"], 0, "(i0?i1:i2)"));
        return toReturn;
    }
    public static getRelationalFunctions(): GPNode[] {
        let toReturn: GPNode[] = [];
        //toReturn.push(new GPNode("gt", "FUNCTION", "BOOLEAN", "return i0>i1;", ["NUMBER", "NUMBER"], 0, "(i0>i1)"));
        //toReturn.push(new GPNode("lt", "FUNCTION", "BOOLEAN", "return i0<i1;", ["NUMBER", "NUMBER"], 0, "(i0<i1)"));
        toReturn.push(new GPNode("numberGt", "FUNCTION", "NUMBER", "return i0>=i1?i0:i1;", ["NUMBER", "NUMBER"], 0, "(i0>=i1?i0:i1)"));
        toReturn.push(new GPNode("numberLt", "FUNCTION", "NUMBER", "return i0<=i1?i0:i1;", ["NUMBER", "NUMBER"], 0, "(i0<=i1?i0:i1)"));
        return toReturn;
    }

    public static getAdvancedMatematicalFunctions(): GPNode[] {
        let toReturn: GPNode[] = [];
        //toReturn.push(new GPNode("sqr", "FUNCTION", "NUMBER", "return i0*i0;", ["NUMBER"], 0, "(i0*i0)"));
        toReturn.push(new GPNode("sin", "FUNCTION", "NUMBER", "return i1*Math.sin(i0);", ["NUMBER", "NUMBER"], 0, "(i1*Math.sin(i0))"));
        //toReturn.push(new GPNode("atan", "FUNCTION", "NUMBER", "return Math.atan(i0);", ["NUMBER"], 0,"(i1*Math.atan(i0))"));
        //toReturn.push(new GPNode("exp", "FUNCTION", "NUMBER", "return Math.exp(i0);", ["NUMBER"], 0,,"Math.exp(i0)"));
        toReturn.push(new GPNode("log", "FUNCTION", "NUMBER", "return Math.log(Math.abs(i0));", ["NUMBER"], 0, "Math.log(Math.abs(i0))"));
        //toReturn.push(new GPNode("sqr3", "FUNCTION", "NUMBER", "return i0*i0*i0;", ["NUMBER"], 0,,"(i0+i0*i0)"));
        return toReturn;
    }

    public static generateFunctions(functions: GPNode[] = Support.getBasicMatematicalFunctions()) {
        return functions.filter(g => g.behavior == "FUNCTION").reduce((p, c) => p + c.getFunction(), "");
    }
    public static combine(gpFunction2: GPNode, gpFunction3: GPNode) {
        let gpFunction4 = gpFunction2.createCopy();
        let gpFunction5 = gpFunction3.createCopy();
        let c1 = gpFunction4.getAllChildrenWithChildren();
        let c2 = gpFunction5.getAllChildrenWithChildren();

        let count1 = 0;
        let n1 = c1[1 + Math.round(c1.length / 2)];
        let n2 = c2[1 + Math.round(c2.length / 2)];
        while (count1 < c1.length * c2.length) {
            n1 = c1[Utils.indexRandom(c1)];
            n2 = c2[Utils.indexRandom(c2)];

            let i1 = Utils.indexRandom(n1.children);
            let n1c = n1.children[i1];

            let i2 = Utils.indexRandom(n2.children);
            let n2c = n2.children[i2];
            if (n1c.returnType == n2c.returnType) {
                n1.dotStyle = "solid";
                n2.dotStyle = "dashed";
                n1c.dotStyle = "solid";
                n2c.dotStyle = "dashed";
                n1.children[i1] = n2c;
                n2.children[i2] = n1c;
                if (Utils.random() < 0.01) {
                    //Project.mutate(gpFunction4);
                }
                if (Utils.random() < 0.01) {
                    //Project.mutate(gpFunction5);
                }
                /*
                                let dot = `digraph Population_${gpFunction2.id}__${gpFunction3.id} {\n`;
                                dot += gpFunction2.getDotToCombine() + "\n";
                                dot += gpFunction3.getDotToCombine() + "\n";
                                dot += gpFunction4.getDotToCombine() + "\n";
                                dot += gpFunction5.getDotToCombine() + "\n";
                
                                dot += "}\n";
                                fs.writeFileSync(`pop/C_${gpFunction2.id}__${gpFunction3.id}.dot`, dot);
                */
                return { i1: gpFunction4, i2: gpFunction5 };
            }


            count1++;
        }
        if (Utils.random() < 0.5) {
            //Project.mutate(gpFunction4);
        }
        if (Utils.random() < 0.5) {
            //Project.mutate(gpFunction5);
        }

        return { i1: gpFunction4, i2: gpFunction5 };

    }

    public static mixIndividuals(individual1: Individual, individual2: Individual): { s1: Individual, s2: Individual } {
        let s1: Individual = new Individual(individual1.inputTypes, individual1.outputType, individual1.maxHeigth, individual1.nodes);
        let s2: Individual = new Individual(individual2.inputTypes, individual2.outputType, individual2.maxHeigth, individual2.nodes);
        let { i1, i2 } = Support.combine(individual1.rootExpression, individual2.rootExpression);
        s1.rootExpression = i1;
        s2.rootExpression = i2;
        return { s1, s2 };
    }

    static mutate(gpFunction5: GPNode): void {
        let pt: GPNode = gpFunction5;
        let prox = pt.children[0];
        let h = 0;
        while (pt.children.length > 0 && h < 2) {
            let pi = Utils.indexRandom(pt.children);
            let prox = pt.children[pi];
            pt = prox;
            h++;
        }
        pt.dotStyle = "rounded,filled"


        if (prox.children.length > 0 && pt.returnType == prox.returnType && pt.children.length == prox.children.length) {
            [prox.name, prox.code, pt.name, pt.code] = [pt.name, pt.code, prox.name, prox.code];
        }
    }



    public static viz = new Viz({ Module, render });

    public static writeSVGToDisk(fileName: string, dot: string) {

        Support.viz.renderString(dot)
            .then(result => {
                fs.writeFileSync(fileName, result, "utf-8");
            })
            .catch(error => {
                Support.viz = new Viz({ Module, render })
                console.error("ERROR:" + error + "\n");
            });
    }

    public static readCSV(name: string): any[] {
        let l = [];
        let data = fs.readFileSync(name).toString().split("\n");
        let fields = data[0].replace("\r", "").split(",");
        for (let i = 1; i < data.length; i++) {
            let row = data[i].replace("\r", "").split(",");
            let obj: any = { index: i };
            fields.forEach((f, j) => obj[f] = parseFloat(row[j]));
            if (obj[fields[0]]) {
                l.push(obj);
            }
        }
        console.log(`${l.length} rows imported`);
        return l;
    }

    public static createTargetValuesFromCSV(filename: string): any[] {
        let targetValues = [];
        let ss = Support.readCSV(filename);
        ss.forEach(s => {
            targetValues.push(s);
        });
        return targetValues;
    }

    public static evalExpressionWithParameters(expression: string, currentValues: any) {
        let keys: any = Object.keys(currentValues);
        let s = `(function (${keys.reduce((p, c, i) => p + c + (i < keys.length - 1 ? ',' : ''), '')})` +
            `{return ${expression}})` +
            `(${keys.reduce((p, c, i) => p + currentValues[c].toString() + (i < keys.length - 1 ? ',' : ''), "")})`;

        return eval(s);
    }

    public static createTargetValuesFromExpression(externalParameters: ExternalParameters[], expression: string, min: number = -10, max: number = 10, step: number = .5): any[] {
        let targetValues = [];
        for (let someParameter = min; someParameter < max; someParameter += step) {
            let targetValue: any = { i: someParameter };
            externalParameters.forEach(ep => { targetValue[ep.name] = Utils.round(someParameter); }); //INICIALIZAR MELHOR FUNCOES COM MAIS VARIAVEIS
            targetValue.output = this.evalExpressionWithParameters(expression, targetValue);
            targetValues.push(targetValue);
        };
        return targetValues;
    }
    public static getSimpleExpression2(node: GPNode) {
        return Utils.replaceAll(Utils.replaceAll(Support.getSimpleExpression(node), "externals['", ""), "']", "");
    }

    public static getSimpleExpression(node: GPNode) {
        if (node.behavior == "CONSTANT") {
            return node.code;
        }
        if (node.behavior == "EXTERNAL") {
            return node.code;
        }


        let e = node.simpleExpression;
        node.children.forEach((c, i) => {

            e = Utils.replaceAll(e, 'i' + i, Support.getSimpleExpression(c));
        })
        //return `${this.name}(${this.children.reduce((p, c, i) => p + c.getExpression() + (i < cInputs - 1 ? ',' : ''), "")})`;
        return e;
    }


    public static readIndividual(initialPopulation: Individual[], name: string) {
        if (fs.existsSync(name)) {
            let ind: Individual = Individual.getInstance(JSON.parse(fs.readFileSync(name).toString()));
            //ind.rootExpression.children[0].deepSimplify();
            ind.fitness = -1;
            initialPopulation.push(ind);
        }
    }



}