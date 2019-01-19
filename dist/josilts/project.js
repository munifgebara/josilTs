"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_expression_1 = require("./node-expression");
const float_costant_leaf_1 = require("./float-costant-leaf");
const float_input_leaf_1 = require("./float-input-leaf");
const individual_1 = require("./individual");
class Project {
    constructor(title, inputType, outputType, terminals, functions, populationSize = 100) {
        this.title = title;
        this.inputType = inputType;
        this.outputType = outputType;
        this.terminals = terminals;
        this.functions = functions;
        this.populationSize = populationSize;
        let booleanFunctions = [
            new node_expression_1.NodeExpression("ifthenelse", "FLOAT", "return a0?a1:a2;", ["BOOLEAN", "FLOAT", "FLOAT"], Project.defaultTerminals, Project.defaultFunctions, 5, 4),
            new node_expression_1.NodeExpression("or", "BOOLEAN", "return a0||a1;", ["BOOLEAN", "BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 4, 3),
            new node_expression_1.NodeExpression("and", "BOOLEAN", "return a0&&a1;", ["BOOLEAN", "BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 4, 3),
            new node_expression_1.NodeExpression("not", "BOOLEAN", "return !a0;", ["BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 2, 1)
        ];
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(new individual_1.Individual(this.inputType, this.outputType, this.terminals, [...this.functions, ...booleanFunctions]));
        }
    }
}
Project.defaultTerminals = [new float_costant_leaf_1.FloatConstantLeaf(-0, 1), new float_costant_leaf_1.FloatConstantLeaf(-10, 10), new float_costant_leaf_1.FloatConstantLeaf(-100, 100), new float_input_leaf_1.FloatInputLeaf("x")];
Project.defaultFunctions = [
    new node_expression_1.NodeExpression("add", "FLOAT", "return a0+a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("sub", "FLOAT", "return a0-a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("mul", "FLOAT", "return a0*a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("div", "FLOAT", "return a1!=0?a0/a1:1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("mod", "FLOAT", "return a1!=0?a0%a1:0;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("eq", "BOOLEAN", "return a0==a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("neq", "BOOLEAN", "return a0!=a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("gt", "BOOLEAN", "return a0>a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("lt", "BOOLEAN", "return a0<a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("zero", "BOOLEAN", "return a0==0;", ["FLOAT"], Project.defaultTerminals, [], 0, 0)
];
exports.Project = Project;
//# sourceMappingURL=project.js.map