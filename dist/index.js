"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const integer_costant_leaf_1 = require("./josilts/integer-costant-leaf");
const float_costant_leaf_1 = require("./josilts/float-costant-leaf");
const integer_input_leaf_1 = require("./josilts/integer-input-leaf");
const node_expression_1 = require("./josilts/node-expression");
const float_input_leaf_1 = require("./josilts/float-input-leaf");
const utils_1 = require("./josilts/utils");
console.log("teste");
function testaFloatConstantLeaf() {
    let soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += new float_costant_leaf_1.FloatConstantLeaf(-10, 10).getValue();
    }
    console.log(soma);
}
function testaIntegerInputLeaf() {
    for (let i = 0; i < 10; i++) {
        console.log(new integer_input_leaf_1.IntegerInputLeaf("i").getValue(i));
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
            let value = new integer_costant_leaf_1.IntegerConstantLeaf(min, max).getValue();
            counter[value]++;
        }
        for (let k = min; k != max; k = k + (min > max ? -1 : 1)) {
            console.log(k, counter[k]);
        }
        console.log(max, counter[max]);
        console.log();
    }
}
function testaNodeExpression() {
    let terminals = [new float_input_leaf_1.FloatInputLeaf("i"), new float_costant_leaf_1.FloatConstantLeaf(-10, 10)];
    let functions = [
        new node_expression_1.NodeExpression("add", "FLOAT", "return a0+a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("sub", "FLOAT", "return a0-a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("mul", "FLOAT", "return a0*a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("div", "FLOAT", "return a1!=0?a0/a1:1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("mod", "FLOAT", "return a1!=0?a0%a1:0;", ["FLOAT", "FLOAT"], terminals, [], 0),
    ];
    let base = functions[utils_1.Utils.integerRandom(0, functions.length - 1)];
    let tree = new node_expression_1.NodeExpression(`tree_${base.functionName}`, "FLOAT", base.code, base.parametersTypes, terminals, functions, 3);
    console.log(tree.name);
    for (let i = 0; i < 10; i++) {
        console.log(i, tree.getValue({ i }));
    }
}
testaNodeExpression();
//testaIntegerInputLeaf();
//testaFloatConstantLeaf();
//testaIntegerConstantLeaf();
//# sourceMappingURL=index.js.map