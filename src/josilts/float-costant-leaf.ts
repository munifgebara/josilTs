import { Leaf } from "./leaf";
import { Utils } from "./utils";



export class FloatConstantLeaf extends Leaf {

    protected value: number;

    constructor(protected min: number, protected max: number) {
        super("FLOAT CONSTANT", "FLOAT", "CONSTANT");
        if (min > max) {
            this.min = max;
            this.max = min;
        }
        this.value = Utils.floatRandom(this.min, this.max);
        this.name += "(" + this.value + ")";
    }

    public getValue(): number {
        return this.value;
    }

}