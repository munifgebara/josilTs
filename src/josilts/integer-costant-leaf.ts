import { Leaf } from "./leaf";
import { Utils } from "./utils";



export class IntegerConstantLeaf extends Leaf {

    protected value: number;

    constructor(protected min: number, protected max: number) {
        super("INTEGER CONSTANT", "INTEGER", "CONSTANT");
        if (min > max) {
            this.min = max;
            this.max = min;
        }
        this.value = Utils.integerRandom(this.min, this.max);
        this.name += "(" + this.value + ")";
    }

    public getValue(): number {
        return this.value;
    }

}