"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const stringify = require("json-stable-stringify");
const integer_costant_leaf_1 = require("./josilts/integer-costant-leaf");
const float_costant_leaf_1 = require("./josilts/float-costant-leaf");
const integer_input_leaf_1 = require("./josilts/integer-input-leaf");
const node_expression_1 = require("./josilts/node-expression");
const float_input_leaf_1 = require("./josilts/float-input-leaf");
const utils_1 = require("./josilts/utils");
const project_1 = require("./josilts/project");
const individual_1 = require("./josilts/individual");
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
function names(n) {
    return n.reduce((p, c) => p + " " + c.name, "");
}
function testaNodeExpression() {
    let terminals = [];
    terminals.push(new float_input_leaf_1.FloatInputLeaf("i"));
    //terminals.push(new BooleanConstantLeaf(true))
    //terminals.push(new BooleanConstantLeaf(false))
    terminals.push(new float_costant_leaf_1.FloatConstantLeaf(-10, 10));
    terminals.push(new float_costant_leaf_1.FloatConstantLeaf(-10, 10));
    terminals.push(new float_costant_leaf_1.FloatConstantLeaf(-10, 10));
    terminals.push(new float_costant_leaf_1.FloatConstantLeaf(-10, 10));
    let functions = [
        new node_expression_1.NodeExpression("add", "FLOAT", "return a0+a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("sub", "FLOAT", "return a0-a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("mul", "FLOAT", "return a0*a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("div", "FLOAT", "return a1!=0?a0/a1:1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("mod", "FLOAT", "return a1!=0?a0%a1:0;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("eq", "BOOLEAN", "return a0==a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("neq", "BOOLEAN", "return a0!=a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("gt", "BOOLEAN", "return a0>a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
        new node_expression_1.NodeExpression("lt", "BOOLEAN", "return a0<a1;", ["FLOAT", "FLOAT"], terminals, [], 0),
    ];
    let functionsType = functions.filter(f => f.type == "FLOAT");
    let base = functionsType[utils_1.Utils.integerRandom(0, functionsType.length - 1)];
    let tree = new node_expression_1.NodeExpression(`tree_${base.functionName}`, base.type, base.code, base.parametersTypes, terminals, functions, 5);
    console.log(tree.name);
    for (let i = 0; i < 10; i++) {
        console.log(tree.getValue({ i }));
    }
    fs.writeFileSync("tree.dot", tree.getDot(), "utf-8");
}
function testaProject() {
    let project = new project_1.Project("f2", "FLOAT", "FLOAT", project_1.Project.defaultTerminals, project_1.Project.defaultFunctions, parseInt(process.argv[2]), parseInt(process.argv[3]));
    for (let x = -10; x <= 10; x += 0.5) {
        project.targetValues.push({ x, f: x * x + 2 * x - 3 });
    }
    let best = project.population[0];
    for (let ge = 0; ge < 10; ge++) {
        console.log("Geracao ", ge);
        ;
        best = project.getBest();
        fs.writeFileSync(`report/best.dot`, best.rootExpression.getDot(), "utf-8");
        project.evolve();
        fs.writeFileSync(`report/pior.dot`, project.population[project.populationSize - 1], "utf-8");
    }
    console.log(parseInt(process.argv[2]), parseInt(process.argv[3]), best.fitness, best.rootExpression.getNodesAsArray().length);
    project.targetValues = [];
    for (let x = -10; x <= 15; x += 0.1) {
        project.targetValues.push({ x, f: x * x + 2 * x - 3 });
    }
    best.writeCSV(project.targetValues);
}
function testaCombina() {
    let mate1 = new individual_1.Individual("FLOAT", "FLOAT", project_1.Project.defaultTerminals, project_1.Project.defaultFunctions, 1);
    let mate2 = new individual_1.Individual("FLOAT", "FLOAT", project_1.Project.defaultTerminals, project_1.Project.defaultFunctions, 1);
    let { s1, s2 } = Object.assign({}, mate1.combine(mate2));
    [s1, s2, mate1, mate2].forEach(i => {
        let v = i.getValue({ x: 10 });
        console.log(v);
        if (v == 0) {
            fs.writeFileSync("report/erro.json", stringify(i, { space: '  ' }), "utf-8");
            process.exit(1);
        }
    });
    fs.writeFileSync(`report/mates.dot`, " digraph G20 {" + mate1.rootExpression.getDotToCombine() + s1.rootExpression.getDotToCombine() + "}", "utf-8");
    fs.writeFileSync(`report/mates2.dot`, " digraph G20 {" + mate2.rootExpression.getDotToCombine() + s2.rootExpression.getDotToCombine() + "}", "utf-8");
}
testaCombina();
//testaProject();
//testaNodeExpression();
//testaIntegerInputLeaf();
//testaFloatConstantLeaf();
//testaIntegerConstantLeaf();
//# sourceMappingURL=index.js.map