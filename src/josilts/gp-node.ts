import { Utils } from "./utils";
import { Project } from "./project";
import { GPBehavior, GPType, Support } from "./support";




export class GPNode {

    public static ID = 0;

    public dotStyle = "filled";

    public children: GPNode[] = [];

    public id = ++GPNode.ID;

    public h = 1;

    public createCopy(): GPNode {
        let ni = new GPNode(this.name, this.behavior, this.returnType, this.code, this.inputTypes, this.minimumHeight);
        ni.children = [];
        this.children.forEach(c => ni.children.push(c.createCopy()));
        return ni;
    }

    constructor(public name: string, public behavior: GPBehavior, public returnType: GPType, public code: string = "NOOP", private inputTypes: GPType[], private minimumHeight: number) {
        this.initNode();
    }

    public initNode() {
        if (this.behavior == "EXTERNAL") {
            this.code = `externals['${this.name}']`;
        } else if (this.behavior == "CONSTANT" && this.code == "NOOP") {
            let v = Math.random();
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
            if (possibileFunctions && (maxHeigth >= 1)) {
                let nc: GPNode = possibileFunctions[Utils.indexRandom(possibileFunctions)].createCopy();
                nc.initChildren(nodes, maxHeigth - 1);
                if (nc.h > higest) {
                    higest = nc.h;
                }
                this.children.push(nc);
            }
            else if (externals.length > 0) {
                this.children.push(externals[Utils.integerRandom(0, externals.length - 1)].createCopy());
            }
            else {
                this.children.push(Support.getConstantNode(type));
            }
        });
        this.h += higest;
    }

    public value(externals: any, nodes: GPNode[]) {
        return eval(Support.generateFunctions(nodes) + this.getExpression());
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
        return tr;
    }

    public label(): string {
        let label: string = `${this.name ? this.name : "N" + this.id}`;
        return label.length < 5 ? label : label.substr(0, 5) + "...";
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
}