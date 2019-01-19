
import { FloatConstantLeaf } from "./float-costant-leaf";
import { IntegerConstantLeaf } from "./integer-costant-leaf";
import { Type, TreeNode } from "./tree-node";
import { Utils } from "./utils";
import { Leaf } from "./leaf";


export class NodeExpression extends TreeNode {
    public static id = 0;

    public expression: string;
    public children: TreeNode[] = [];

    constructor(public functionName: string, type: Type, public code: string, public parametersTypes: Type[], public terminals: Leaf[], public functions: NodeExpression[], public maxHeight: number = 4) {
        super(functionName, type);

        this.expression = `function ${this.name} ${this.parametersTypes.reduce((p, c, i) => p + "a" + i + (i < this.parametersTypes.length - 1 ? "," : ")"), "(")} {${this.code}}`;
        this.parametersTypes.forEach(pt => {
            let r = Utils.integerRandom(0, maxHeight);
            if (r > 0) {
                let ne = this.functions.filter(n => n.type == pt)[Utils.integerRandom(0, functions.length - 1)];
                this.children.push(ne);
            }
            else {
                let nn = this.terminals.filter(n => n.type == pt)[Utils.integerRandom(0, terminals.length - 1)];
                this.children.push(nn);
            }



        });
        this.name += `${this.children.reduce((p, c: TreeNode, i) => p + c.name + (i < this.children.length - 1 ? "," : ""), "(")})`;
    }

    public getValue(input: any) {
        let ex = `${this.expression} ${this.functionName}${this.children.reduce((p, c: TreeNode, i) => p + c.getValue(input) + (i < this.children.length - 1 ? "," : ")"), "(")}`;
        return eval(ex);
    }








}