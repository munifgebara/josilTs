import { Leaf } from "./leaf";
import { Utils } from "./utils";



export class FloatInputLeaf extends Leaf {

    constructor(protected inputName: string) {
        super("FLOAT INPUT", "FLOAT", "INPUT");
        this.name += "(" + this.inputName + ")";
    }

    public getValue(input: any) {
        return input[this.inputName];
    }

}