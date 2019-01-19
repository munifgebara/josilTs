import { IntegerConstantLeaf } from "./josilts/integer-costant-leaf";
import { FloatConstantLeaf } from "./josilts/float-costant-leaf";
import { IntegerInputLeaf } from "./josilts/integer-input-leaf";
import { NodeExpression } from "./josilts/node-expression";
import { FloatInputLeaf } from "./josilts/float-input-leaf";
import { Leaf } from "./josilts/leaf";
import { Utils } from "./josilts/utils";
import { TreeNode } from "./josilts/tree-node";
import { BooleanConstantLeaf } from "./josilts/boolean-costant-leaf";

console.log("teste");

function testaFloatConstantLeaf() {
    let soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += new FloatConstantLeaf(-10, 10).getValue();
    }
    console.log(soma);

}
function testaIntegerInputLeaf() {
    for (let i = 0; i < 10; i++) {
        console.log(new IntegerInputLeaf("i").getValue(i));
    }

}

function testaIntegerConstantLeaf() {
    for (let i = -10; i <= 10; i++) {
        let min = 0;
        let max = i;
        let counter = [];
        counter[max] = 0;
        for (let k = min; k != max; k = k + (min > max ? -1 : 1)) {
            counter[k] = 0;
        }
        for (let j = 0; j < 10000; j++) {
            let value = new IntegerConstantLeaf(min, max).getValue();
            counter[value]++;
        }

        for (let k = min; k != max; k = k + (min > max ? -1 : 1)) {
            console.log(k, counter[k]);
        }
        console.log(max, counter[max]);
        console.log();
    }
}

function names(n: TreeNode[]) {
    return n.reduce((p, c) => p + " " + c.name, "");

}

function testaNodeExpression() {
    let terminals = [new FloatInputLeaf("i"), new FloatConstantLeaf(-10, 10), new BooleanConstantLeaf()];
    let functions = [
        new NodeExpression("add", "FLOAT", "return a0+a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("sub", "FLOAT", "return a0-a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("mul", "FLOAT", "return a0*a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("div", "FLOAT", "return a1!=0?a0/a1:1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("mod", "FLOAT", "return a1!=0?a0%a1:0;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("eq", "BOOLEAN", "return a0==a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("neq", "BOOLEAN", "return a0!=a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("gt", "BOOLEAN", "return a0>a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("lt", "BOOLEAN", "return a0<a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new NodeExpression("ifthenelse", "FLOAT", "return a0?a1:a2;", ["BOOLEAN", "FLOAT", "FLOAT"], terminals, [], 0),
    ];
    let soma = 0;
    for (let j = 0; j < 1000; j++) {
        let functionsType = functions.filter(f => f.type == "FLOAT");
        let base = functionsType[Utils.integerRandom(0, functionsType.length - 1)];
        let tree = new NodeExpression(`tree_${base.functionName}`, base.type, base.code, base.parametersTypes, terminals, functions, 3);

        for (let i = 0; i < 10; i++) {
            soma += tree.getValue({ i });
        }

    }
    console.log(soma);







}
testaNodeExpression();

//testaIntegerInputLeaf();
//testaFloatConstantLeaf();
//testaIntegerConstantLeaf();