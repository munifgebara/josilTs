import { Leaf } from "./leaf";
import { NodeExpression } from "./node-expression";
import { FloatConstantLeaf } from "./float-costant-leaf";
import { FloatInputLeaf } from "./float-input-leaf";
import { Type } from "./tree-node";
import { Individual } from "./individual";
import { BooleanConstantLeaf } from "./boolean-costant-leaf";

export class Project {

    public static defaultTerminals: Leaf[] = [new FloatConstantLeaf(-0, 1), new FloatConstantLeaf(-10, 10), new FloatConstantLeaf(-100, 100), new FloatInputLeaf("x")];

    public static defaultFunctions = [
        new NodeExpression("add", "FLOAT", "return a0+a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("sub", "FLOAT", "return a0-a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("mul", "FLOAT", "return a0*a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("div", "FLOAT", "return a1!=0?a0/a1:1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("mod", "FLOAT", "return a1!=0?a0%a1:0;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("eq", "BOOLEAN", "return a0==a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("neq", "BOOLEAN", "return a0!=a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("gt", "BOOLEAN", "return a0>a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("lt", "BOOLEAN", "return a0<a1;", ["FLOAT", "FLOAT"], Project.defaultTerminals, [], 0),
        new NodeExpression("zero", "BOOLEAN", "return a0==0;", ["FLOAT"], Project.defaultTerminals, [], 0, 0)
    ];


    public population: Individual[];

    constructor(public title: string, public inputType: Type, public outputType: Type, public terminals: Leaf[], public functions: NodeExpression[], public populationSize: number = 100) {
        let booleanFunctions: NodeExpression[] = [
            new NodeExpression("ifthenelse", "FLOAT", "return a0?a1:a2;", ["BOOLEAN", "FLOAT", "FLOAT"], Project.defaultTerminals, Project.defaultFunctions, 5, 4),
            new NodeExpression("or", "BOOLEAN", "return a0||a1;", ["BOOLEAN", "BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 4, 3),
            new NodeExpression("and", "BOOLEAN", "return a0&&a1;", ["BOOLEAN", "BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 4, 3),
            new NodeExpression("not", "BOOLEAN", "return !a0;", ["BOOLEAN"], Project.defaultTerminals, Project.defaultFunctions, 2, 1)
        ];


        this.population = [];
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(new Individual(this.inputType, this.outputType, this.terminals, [...this.functions, ...booleanFunctions]));
        }
    }



}

