import { Leaf } from "./leaf";
import { Utils } from "./utils";



export class BooleanConstantLeaf extends Leaf {

    protected value: boolean;

    constructor() {
        super("BOOLEAN CONSTANT", "BOOLEAN", "CONSTANT");
        this.value = Utils.integerRandom(0, 1) == 1;
        this.name += "(" + this.value + ")";
    }

    public getValue(): boolean {
        return this.value;
    }

}