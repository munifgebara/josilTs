import * as fs from 'fs';
import { Leaf } from "./leaf";
import { NodeExpression } from "./node-expression";
import { FloatConstantLeaf } from "./float-costant-leaf";
import { FloatInputLeaf } from "./float-input-leaf";
import { Type } from "./tree-node";

export class Individual {

    public static ID = 0;

    public id: number = 0;

    public rootExpression: NodeExpression;

    constructor(public inputType: Type, public outputType: Type, public terminals: Leaf[], public functions: NodeExpression[]) {
        this.id = ++Individual.ID;
        this.rootExpression = new NodeExpression("I" + this.id, this.inputType, "return a0;", [this.outputType], this.terminals, this.functions, 5, 0);
    }

    public getValue(input: any) {
        return this.rootExpression.getValue(input);
    }

    public writeDot(): void {
        fs.writeFileSync(`report/i${this.id}.dot`, this.rootExpression.getDot(), "utf-8");
    }

}

