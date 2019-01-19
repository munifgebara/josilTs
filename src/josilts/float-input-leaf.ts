import { Leaf } from "./leaf";
import { Utils } from "./utils";



export class FloatInputLeaf extends Leaf {

    constructor(public inputName: string) {
        super("FLOAT INPUT", "FLOAT", "INPUT");
        this.name += "(" + this.inputName + ")";
        this.desc = "" + this.inputName;
    }

    public getValue(input: any) {
        return input[this.inputName];
    }

    public newIntance(): FloatInputLeaf {
        return new FloatInputLeaf("" + this.inputName);
    }

    public copy(): FloatInputLeaf {
        return new FloatInputLeaf("" + this.inputName);
    }


}