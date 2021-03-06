import { Utils } from "./utils";
import { Project } from "./project";
import { GPBehavior, GPType, Support } from "./support";
import { NOMEM, TIMEOUT } from "dns";




export class GPNode {


    public static ALL: GPNode[] = [];

    public static getInstance(data: any): GPNode {
        let newInstance = new GPNode("CLONE", "FUNCTION", "NUMBER");
        Object.assign(newInstance, data);
        newInstance.children = [];
        data.children.forEach(c => newInstance.children.push(GPNode.getInstance(c)));
        return newInstance;
    }


    public static ID = 0;

    public dotStyle = "filled";

    public children: GPNode[] = [];

    public id = ++GPNode.ID;

    public h = 1;


    public createCopy(): GPNode {
        let code = this.behavior == "CONSTANT" ? "NOOP" : this.code;
        let ni = new GPNode(this.name, this.behavior, this.returnType, code, this.inputTypes, this.minimumHeight);
        if (this.behavior == "CONSTANT") {
            ni.code = this.code;
            ni.name = this.code;
        }
        ni.children = [];
        this.children.forEach(c => ni.children.push(c.createCopy()));
        return ni;
    }

    constructor(public name: string, public behavior: GPBehavior, public returnType: GPType, public code: string = "NOOP", private inputTypes: GPType[] = [], private minimumHeight: number = 0, public simpleExpression: string | null = null) {
        GPNode.ALL.push(this);
        if (name == "CLONE") {
            return;
        }
        if (simpleExpression == null) {
            this.simpleExpression = "(" + Utils.replaceAll(Utils.replaceAll(code, "return ", ""), ";", "") + ")";
        }
        this.initNode();
    }

    public initNode() {
        if (this.behavior == "EXTERNAL") {
            this.code = `externals['${this.name}']`;
        } else if (this.behavior == "CONSTANT" && this.code == "NOOP") {
            let v = Utils.random();
            this.code = v.toString();
            this.name = v.toString();
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
        let higest = 1;
        this.inputTypes.forEach(type => {
            let externals = nodes.filter(f => f.behavior == "EXTERNAL" && f.returnType == type);
            let possibileFunctions = nodes.filter(f => f.behavior == "FUNCTION" && f.returnType == type);

            if (possibileFunctions && (maxHeigth > 2)) {
                let nc: GPNode = possibileFunctions[Utils.indexRandom(possibileFunctions)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                this.children.push(nc);
                if (nc.h > higest) {
                    higest = nc.h;
                }
            }
            else if (maxHeigth > 1) {
                let allNodes: GPNode[] = [...possibileFunctions, ...externals, ...Support.getIntegerConstantNodes(4)];
                let nc: GPNode = allNodes[Utils.indexRandom(allNodes)].createCopy();
                if (nc.behavior == "FUNCTION") {
                    nc.initChildren(nodes, maxHeigth - 1);
                }
                this.children.push(nc);
                if (nc.h > higest) {
                    higest = nc.h;
                }
            }
            else {
                let allNodes: GPNode[] = [...externals, ...externals, ...Support.getConstantNodes(4, type), ...Support.getIntegerConstantNodes(4)];
                let nc: GPNode = allNodes[Utils.indexRandom(allNodes)].createCopy();
                this.children.push(nc);
            }
        });
        this.h += higest;
    }

    public value(externals: any, nodes: GPNode[]) {
        return eval(Support.getSimpleExpression(this)); //eval(Support.generateFunctions(nodes) + this.getExpression());
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
        dot.push(`N${current.id}[ style="${current.dotStyle}"  label="${current.label()}"];`);
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
        tr.shift();
        return tr;
    }

    public label(): string {
        let label: string = `${this.name ? this.name : "N" + this.id}`;
        return label.length < 5 ? label : (label.substr(0, 8) + "...");
    }

    public updateH(): void {
        if (this.children.length == 0) {
            this.h = 1;
        }
        else {
            let max = 0;
            this.children.forEach(c => {
                c.updateH();
                if (c.h > max) {
                    max = c.h;
                }
            });
            this.h = 1 + max;
        }
    }

    public getInfo(): string {
        let fieldsOfInterest = ['id', 'name', 'behavior', 'h', 'returnType', 'inputTypes'];
        let info = fieldsOfInterest.reduce((p, c) => p + c.toUpperCase() + ":" + this[c] + " ", "");
        info += `Number of children:${this.children.length} `
        if (this.getExpression()) info += `RootExpression:(${this.getExpression().substr(0, 20)}...)`;
        return info;
    }



    deepSimplify(): GPNode {
        let c: GPNode[] = this.getAllChildrenWithSimpleChildren();
        c.forEach((cc, i) => {
            let p = cc.children.reduce((ppp, ccc) => ppp + (ccc.behavior === "CONSTANT" ? 0 : 1), 0);
            if (p == 0) {
                let v = cc.value([], []);
                cc.behavior = "CONSTANT";
                cc.code = "" + v;
                cc.name = "" + v;
                cc.children = [];
            }
        });
        return this;
    }


    private addChildrenWithSimpleChildren(current: GPNode, all: GPNode[]) {
        if (current.children.length > 0) {
            let lc = current.children.reduce((ppp, ccc) => ppp + ccc.children.length, 0);
            if (lc == 0) all.push(current);
            current.children.forEach(c => this.addChildrenWithSimpleChildren(c, all));
        }
    }

    public getAllChildrenWithSimpleChildren(): GPNode[] {
        let tr: GPNode[] = [];
        this.addChildrenWithSimpleChildren(this, tr);

        return tr;
    }



}