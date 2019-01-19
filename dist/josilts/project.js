"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const node_expression_1 = require("./node-expression");
const float_costant_leaf_1 = require("./float-costant-leaf");
const float_input_leaf_1 = require("./float-input-leaf");
const individual_1 = require("./individual");
class Project {
    constructor(title, inputType, outputType, terminals, functions, populationSize = 100, maxHeigth = 5) {
        this.title = title;
        this.inputType = inputType;
        this.outputType = outputType;
        this.terminals = terminals;
        this.functions = functions;
        this.populationSize = populationSize;
        this.maxHeigth = maxHeigth;
        this.targetValues = [];
        let booleanFunctions = [
        // new NodeExpression("ifthenelse", "FLOAT", "return a0?a1:a2;", ["BOOLEAN", "FLOAT", "FLOAT"], Project.defaultTerminals, Project.defaultFunctions, 5, 4),
        // new NodeExpression("or", "BOOLEAN", "return a0||a1;", ["BOOLEAN", "BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 4, 3),
        // new NodeExpression("and", "BOOLEAN", "return a0&&a1;", ["BOOLEAN", "BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 4, 3),
        // new NodeExpression("not", "BOOLEAN", "return !a0;", ["BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 2, 1)
        ];
        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(new individual_1.Individual(this.inputType, this.outputType, this.terminals, [...this.functions, ...booleanFunctions], 1 + i % maxHeigth));
        }
    }
    getBest() {
        let best;
        this.population.forEach((ind, i) => {
            ind.updateFitness(this.targetValues);
            if (i == 0 || ind.fitness < best.fitness) {
                best = ind;
                process.stdout.write("Best fit " + i + " " + ind.fitness + "                            \r");
                fs.writeFileSync(`report/best.dot`, best.rootExpression.getDot(), "utf-8");
            }
            if (i % 100 == 0) {
                process.stdout.write("Best fit " + i + " " + best.fitness + "                                 \r");
            }
        });
        process.stdout.write("\n");
        return best;
    }
    evolve() {
        this.population.sort((a, b) => a.fitness - b.fitness);
        let metade = Math.floor(this.populationSize / 2);
        for (let i = 0; i < metade; i += 2) {
            let j = metade + i;
            let r = this.population[i].combine(this.population[i + 1]);
            this.population[j] = r.s1;
            this.population[j + 1] = r.s2;
        }
    }
}
Project.defaultTerminals = [new float_costant_leaf_1.FloatConstantLeaf(-100, 100), new float_input_leaf_1.FloatInputLeaf("x")];
Project.defaultFunctions = [
    new node_expression_1.NodeExpression("add", "FLOAT", "return a0+a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("add3", "FLOAT", "return a0+a1+a2;", ["FLOAT", "FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("add4", "FLOAT", "return a0+a1+a2+a3;", ["FLOAT", "FLOAT", "FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("sub", "FLOAT", "return a0-a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("mul", "FLOAT", "return a0*a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("div", "FLOAT", "return a1!=0?a0/a1:1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("sqr", "FLOAT", "return a0*a0;", ["FLOAT"], Project.defaultTerminals, [], 0),
    new node_expression_1.NodeExpression("mod", "FLOAT", "return a1!=0?a0%a1:0;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
];
exports.Project = Project;
//# sourceMappingURL=project.js.map