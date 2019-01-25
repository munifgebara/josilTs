import { Utils } from "./utils";


export type GPType = "NUMBER" | "BOOLEAN" | "STRING";
export type GPBehavior = "CONSTANT" | "EXTERNAL" | "FUNCTION";

export class GPNode {

    public static ID = 0;

    public static getNumberConstantNode(min: number = -1, max: number = 1): GPNode {
        let c = new GPNode("New Constant", "CONSTANT", "NUMBER");
        c.code = (min + (Math.random() * (max - min))).toString();
        return c;
    }

    public static getNumberConstantNodes(quantity: number, min: number = -1, max: number = 1): GPNode[] {
        let toReturn: GPNode[] = [];
        for (let i = 0; i < quantity; i++) {
            toReturn.push(GPNode.getNumberConstantNode(min, max));
        }
        return toReturn;
    }

    public static FUNCTIONS: string;

    public static getGenericFunctions(): GPNode[] {
        let toReturn: GPNode[] = [];
        toReturn.push(new GPNode("add", "FUNCTION", "NUMBER", "return i0+i1;", ["NUMBER", "NUMBER"]));
        //toReturn.push(new GPNode("sub", "FUNCTION", "NUMBER", "return i0-i1;", ["NUMBER", "NUMBER"]));
        toReturn.push(new GPNode("mul", "FUNCTION", "NUMBER", "return i0*i1;", ["NUMBER", "NUMBER"]));
        //toReturn.push(new GPNode("div", "FUNCTION", "NUMBER", "return i1==0?1:i0/i1;", ["NUMBER", "NUMBER"]));

        // toReturn.push(new GPNode("and", "FUNCTION", "BOOLEAN", "return i0&&i1;", ["BOOLEAN", "BOOLEAN"]));
        // toReturn.push(new GPNode("or", "FUNCTION", "BOOLEAN", "return i0||i1;", ["BOOLEAN", "BOOLEAN"]));
        // toReturn.push(new GPNode("not", "FUNCTION", "BOOLEAN", "return !i0;", ["BOOLEAN"]));
        // toReturn.push(new GPNode("ifthenelse", "FUNCTION", "NUMBER", "return i0?i1:i2;", ["BOOLEAN", "NUMBER", "NUMBER"]));

        // toReturn.push(new GPNode("gt", "FUNCTION", "BOOLEAN", "return i0>i1;", ["NUMBER", "NUMBER"]));
        // toReturn.push(new GPNode("lt", "FUNCTION", "BOOLEAN", "return i0<i1;", ["NUMBER", "NUMBER"]));



        //toReturn.push(new GPNode("sqr", "FUNCTION", "NUMBER", "return i0*i0;", ["NUMBER"]));
        //
        //      toReturn.push(new GPNode("sqr3", "NUMBER", "return i0*i0*i0;", ["NUMBER"]));
        //toReturn.push(new GPNode("mod", "NUMBER", "return i1==0?i0:i0%i1;", ["NUMBER", "NUMBER"]));

        //toReturn.push(new GPNode("gt", "NUMBER", "return i0>=i1?i0:i1;", ["NUMBER", "NUMBER"]));
        //toReturn.push(new GPNode("lt", "NUMBER", "return i0<=i1?i0:i1;", ["NUMBER", "NUMBER"]));
        return toReturn;
    }

    public static generateFunctions(functions: GPNode[] = GPNode.getGenericFunctions()) {
        if (!GPNode.FUNCTIONS) {
            GPNode.FUNCTIONS = functions.reduce((p, c) => p + c.getFunction(), "");
        }
        return this.FUNCTIONS;
    }


    public static combine(gpFunction2: GPNode, gpFunction3: GPNode) {
        let gpFunction4 = gpFunction2.createCopy();
        let gpFunction5 = gpFunction3.createCopy();
        let c1 = gpFunction4.getAllChildrenWithChildren();
        let c2 = gpFunction5.getAllChildrenWithChildren();

        let count1 = 0;
        while (count1 < c1.length * c2.length) {
            let n1 = c1[Utils.indexRandom(c1)];
            let i1 = Utils.indexRandom(n1.children);
            let n1c = n1.children[i1];
            let n2 = c2[Utils.indexRandom(c2)];
            let i2 = Utils.indexRandom(n2.children);
            let n2c = n2.children[i2];
            if (n1c.returnType == n2c.returnType) {
                n1.dotStyle = "solid";
                n2.dotStyle = "solid";
                n1c.dotStyle = "dashed";
                n2c.dotStyle = "dashed";
                n1.children[i1] = n2c;
                n2.children[i2] = n1c;
                return { i1: gpFunction4, i2: gpFunction5 };
            }
            count1++;
        }
        return { i1: gpFunction4, i2: gpFunction5 };

    }

    public dotStyle = "filled";

    public children: GPNode[] = [];

    public id = ++GPNode.ID;

    public h = 0;

    public createCopy(): GPNode {
        let ni = new GPNode(this.name, this.behavior, this.returnType, this.code, this.inputTypes, this.minimumHeight);
        ni.children = [];
        this.children.forEach(c => ni.children.push(c.createCopy()));
        return ni;
    }

    constructor(private name: string, private behavior: GPBehavior, private returnType: GPType, private code: string = "", private inputTypes: GPType[] = [], private minimumHeight: number = 0) {
        this.initNode();
    }

    public initNode() {
        if (this.behavior == "EXTERNAL") {
            this.code = `externals['${this.name}']`;
        } else if (this.behavior == "CONSTANT" && !this.code) {
            let v = Math.random();
            this.code = v.toString();
            this.name = (Math.round(v * 100) / 100).toString();
        }

    }


    public getFunction(): string {
        const cInputs = this.inputTypes.length;
        return `function ${this.name}(${this.inputTypes.reduce((p, c, i) => p + 'i' + i + (i < cInputs - 1 ? ',' : ''), "")}){\n ${this.code}\n}\n`;
    }

    public getExpression(externals: any = {}): string {
        if (this.behavior == "CONSTANT" || this.behavior == "EXTERNAL") {
            return this.code;
        }
        const cInputs = this.inputTypes.length;
        return `${this.name}(${this.children.reduce((p, c, i) => p + c.getExpression() + (i < cInputs - 1 ? ',' : ''), "")})`;
    }

    public initChildren(nodes: GPNode[], maxHeigth: number = 4) {

        this.children = [];

        this.inputTypes.forEach(type => {

            let externals = nodes.filter(f => f.behavior == "EXTERNAL" && f.returnType == type);
            let possibileFunctions = GPNode.getGenericFunctions().filter(f => f.returnType == type);
            if (possibileFunctions && (maxHeigth >= 1 || externals.length == 0)) {
                let nc: GPNode = possibileFunctions[Utils.integerRandom(0, possibileFunctions.length - 1)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                this.children.push(nc);
            }
            else if (type == "NUMBER" && Math.random() > 0.5) {
                this.children.push(GPNode.getNumberConstantNode());
            }
            else {
                this.children.push(externals[Utils.integerRandom(0, externals.length - 1)].createCopy());
            }
        });
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
        dot.push(`N${current.id}[ style=${current.dotStyle}  label="${current.label()}"];`);
        current.children.forEach(n => {
            dot.push(`N${current.id} -> N${n.id};`);
            this.buildDot(n, dot);
        });
    }


    private addChildrenWithChildren(current: GPNode, all: GPNode[]) {
        if (current.children.length > 0) {
            all.push(current);
            current.children.forEach(c => this.addChildrenWithChildren(c, all));
        }
    }

    public getAllChildrenWithChildren(): GPNode[] {
        let tr: GPNode[] = [];
        this.addChildrenWithChildren(this, tr);
        return tr;
    }

    public label(): string {
        return `${this.name ? this.name : "N" + this.id}`;
    }

    public height(): number {
        if (this.h > 0) {
            return this.h;
        }
        if (this.children.length == 0) {
            this.h = 1;
            return 1;
        }
        else {
            let max = 0;
            this.children.forEach(c => {
                let al = c.height();
                if (al > max) {
                    max = al;
                }
            });
            this.h = 1 + max;
            return 1 + max;
        }
    }




}