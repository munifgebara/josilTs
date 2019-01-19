import { Leaf } from "./leaf";
import { Utils } from "./utils";



export class BooleanConstantLeaf extends Leaf {



    constructor(protected value: boolean) {
        super("BOOLEAN CONSTANT", "BOOLEAN", "CONSTANT");
        this.name += "(" + this.value + ")";
        this.desc = "" + value;
    }

    public getValue(): boolean {
        return this.value;
    }

    public newIntance(): BooleanConstantLeaf {
        return new BooleanConstantLeaf(this.value);
    }

}