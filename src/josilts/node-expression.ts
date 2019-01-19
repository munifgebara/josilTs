
import { FloatConstantLeaf } from "./float-costant-leaf";
import { IntegerConstantLeaf } from "./integer-costant-leaf";
import { Type, TreeNode } from "./tree-node";
import { Utils } from "./utils";
import { Leaf } from "./leaf";
import { BooleanConstantLeaf } from "./boolean-costant-leaf";


export class NodeExpression extends TreeNode {


    public expression: string;
    public children: TreeNode[] = [];

    constructor(public functionName: string, type: Type, public code: string, public parametersTypes: Type[], public terminals: Leaf[], public functions: NodeExpression[], public maxHeight: number = 4, public minHeight: number = 0) {
        super(functionName, type);
        this.desc = "" + this.functionName;
        this.expression = `function ${this.name} ${this.parametersTypes.reduce((p, c, i) => p + "a" + i + (i < this.parametersTypes.length - 1 ? "," : ")"), "(")} {${this.code}}`;

        for (let i = 0; i < this.parametersTypes.length; i++) {
            let pt = this.parametersTypes[i];
            let possibleFunctions = functions.filter(n => n.type == pt && n.minHeight <= maxHeight);
            let possibleTerminals = terminals.filter(n => n.type == pt);

            if (minHeight <= maxHeight && possibleFunctions.length > 0) {
                let ne = possibleFunctions[Utils.integerRandom(0, possibleFunctions.length - 1)];
                this.children.push(new NodeExpression(`n_${ne.functionName}`, ne.type, ne.code, ne.parametersTypes, terminals, functions, maxHeight - 1));
            }
            else if (possibleTerminals.length > 0) {
                this.children.push(possibleTerminals[Utils.integerRandom(0, possibleTerminals.length - 1)].newIntance());
            }
            else {
                console.log(`${functionName} ${possibleTerminals.length}/${terminals.length}   ${possibleFunctions.length}/${functions.length}  ${minHeight}<${maxHeight}`);
            }

        }

        this.name += `${this.children.reduce((p, c: TreeNode, i) => p + c.name + (i < this.children.length - 1 ? "," : ""), "(")})`;
    }

    public getValue(input: any) {
        let ex = `${this.expression} ${this.functionName}${this.children.reduce((p, c: TreeNode, i) => p + c.getValue(input) + (i < this.children.length - 1 ? "," : ")"), "(")}`;
        return eval(ex);
    }

    public getDot() {
        let dot = [` digraph G${this.id} {`];
        this.percorre(this, dot, 1);
        dot.push("}");
        return dot.reduce((p, c) => p + c + '\n', '');
    }

    public getDotToCombine() {
        let dot = [];
        this.percorre(this, dot, 1);
        return dot.reduce((p, c) => p + c + '\n', '');
    }


    private percorre(no: TreeNode, dot: string[], h: number) {
        dot.push(`N${no.id} [label="${no.desc}"];`);
        if (no['children']) {
            no['children'].forEach(f => {
                dot.push(`N${no.id} -> N${f.id};`);
                this.percorre(f, dot, h + 1);
            });

        }

    }

    public getNodesAsArray(): TreeNode[] {
        let toReturn: TreeNode[] = [];
        this.getNodes(toReturn, this);
        return toReturn;
    }

    public getNodes(all: TreeNode[], current: TreeNode) {
        all.push(current.copy());
        if (current['children']) {
            current['children'].forEach(c => {
                this.getNodes(all, c);
            });
        }
    }

    public copy(): NodeExpression {
        let n = new NodeExpression(`${this.functionName}`, this.type, this.code, this.parametersTypes, this.terminals, this.functions, this.maxHeight);
        n.children = [];
        this.children.forEach(c => n.children.push(c.copy()));
        return n;
    }


}