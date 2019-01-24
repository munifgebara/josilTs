import { Utils } from "./utils";


export type GPType = "NUMBER" | "BOOLEAN" | "STRING" | "EXTERNAL";

export class GPNode {

    public static ID = 0;

    public static getNumberConstantNode(): GPNode {
        return new GPNode("CONSTANT", "NUMBER");
    }

    public static getNumberConstantNodes(quantity: number): GPNode[] {
        let toReturn: GPNode[] = [];
        for (let i = 0; i < quantity; i++) {
            toReturn.push(new GPNode("CONSTANT", "NUMBER"));
        }
        return toReturn;

    }

    public static FUNCTIONS: string;

    public static getGenericFunctions(): GPNode[] {
        let toReturn: GPNode[] = [];
        toReturn.push(new GPNode("idt", "NUMBER", "return i0;", ["NUMBER"]));
        toReturn.push(new GPNode("add", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"]));
        //        toReturn.push(new GPNode("sub", "NUMBER", "return i0-i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("mul", "NUMBER", "return i0*i1;", ["NUMBER", "NUMBER"]));
        //      toReturn.push(new GPNode("div", "NUMBER", "return i1==0?1:i0/i1;", ["NUMBER", "NUMBER"]));
        //        toReturn.push(new GPNode("sqr", "NUMBER", "return i0*i0;", ["NUMBER"]));
        //      toReturn.push(new GPNode("sqr3", "NUMBER", "return i0*i0*i0;", ["NUMBER"]));
        //toReturn.push(new GPNode("mod", "NUMBER", "return i1==0?i0:i0%i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("dom", "NUMBER", "return externals.w==1?0:i0", ["NUMBER"]));
        //toReturn.push(new GPNode("gt", "NUMBER", "return i0>=i1?i0:i1;", ["NUMBER", "NUMBER"]));
        //toReturn.push(new GPNode("lt", "NUMBER", "return i0<=i1?i0:i1;", ["NUMBER", "NUMBER"]));
        return toReturn;
    }

    public static generateFunctions(functions: GPNode[] = GPNode.getGenericFunctions()) {
        if (!GPNode.FUNCTIONS) {
            console.log("FUNC")
            GPNode.FUNCTIONS = functions.reduce((p, c) => p + c.getFunction(), "");
        }
        return this.FUNCTIONS;
    }


    public children: GPNode[] = [];

    public id = ++GPNode.ID;

    public createCopy(): GPNode {
        let ni = new GPNode(this.name, this.returnType, this.code, this.inputTypes, this.minimumHeight);
        ni.children = [];
        this.children.forEach(c => ni.children.push(c.createCopy()));
        return ni;
    }

    constructor(private name: string, private returnType: GPType, private code: string = Utils.floatRandom(-1000, 1000).toString(), private inputTypes: GPType[] = [], private minimumHeight: number = 0) {
        this.initNode();

    }

    public getFunction(): string {
        const cInputs = this.inputTypes.length;
        return `function ${this.name}(${this.inputTypes.reduce((p, c, i) => p + 'i' + i + (i < cInputs - 1 ? ',' : ''), "")}){\n ${this.code}\n}\n`;
    }

    public getExpression(externals: any = {}): string {
        if (this.children.length == 0) {
            return this.code;
        }
        const cInputs = this.inputTypes.length;
        return `${this.name}(${this.children.reduce((p, c, i) => p + c.getExpression() + (i < cInputs - 1 ? ',' : ''), "")})`;
    }

    public initChildren(nodes: GPNode[], maxHeigth: number = 4) {
        this.children = [];
        let possibleLeafs: GPNode[] = [...GPNode.getNumberConstantNodes(this.inputTypes.length), ...nodes.filter(n => (n.returnType == "EXTERNAL"))];
        let functions: GPNode[] = GPNode.getGenericFunctions();
        let all: GPNode[] = [...possibleLeafs, ...functions];

        this.inputTypes.forEach(type => {
            if (maxHeigth > 1) {
                let nc: GPNode = functions[Utils.integerRandom(0, functions.length - 1)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                this.children.push(nc);
            }
            else if (maxHeigth == 1) {
                let nc: GPNode = all[Utils.integerRandom(0, all.length - 1)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                this.children.push(nc);
            }
            else {
                let nc: GPNode = possibleLeafs[Utils.integerRandom(0, possibleLeafs.length - 1)].createCopy();
                this.children.push(nc);
            }
        });

    }


    public initNode() {
        if (this.returnType == "EXTERNAL") {
            this.code = `externals['${this.name}']`;
        }
    }

    public value(externals: any) {
        return eval(GPNode.generateFunctions() + this.getExpression());
    }

    public getDot(s: string = "s") {
        let dot = [` digraph G${this.id} {`];
        this.buildDot(this, dot);
        dot.push("}");
        dot[1] = dot[1].replace(`label=""`, `label="${s}"`);
        return dot.reduce((p, c) => p + c + '\n', '');
    }

    public getDotToCombine() {
        let dot = [];
        this.buildDot(this, dot);
        return dot.reduce((p, c) => p + c + '\n', '');
    }

    private buildDot(current: GPNode, dot: string[]): any {
        dot.push(`N${current.id} [label="${current.label()}"];`);
        current.children.forEach(n => {
            dot.push(`N${current.id} -> N${n.id};`);
            this.buildDot(n, dot);
        });
    }


    private addFunctions(current: GPNode, all: GPNode[]) {
        if (current.children.length > 0) {
            all.push(current);
            current.children.forEach(c => this.addFunctions(c, all));
        }
    }

    public getAllFunctions(): GPNode[] {
        let tr: GPNode[] = [];
        this.addFunctions(this, tr);
        return tr;
    }

    public label(): string {
        return `${this.name != "CONSTANT" ? this.name : this.code.substr(0, 5)}`;
    }


}