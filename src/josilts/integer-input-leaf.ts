import { Leaf } from "./leaf";
import { Utils } from "./utils";



export class IntegerInputLeaf extends Leaf {

    constructor(protected inputName: string) {
        super("INTEGER INPUT", "INTEGER", "INPUT");
        this.name += "(" + this.inputName + ")";
    }

    public getValue(input: any) {
        return input[this.inputName];
    }
}