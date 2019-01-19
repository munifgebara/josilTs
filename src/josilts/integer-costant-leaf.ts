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
        this.desc = "" + this.value;
    }

    public getValue(): number {
        return this.value;
    }

    public newIntance(): IntegerConstantLeaf {
        return new IntegerConstantLeaf(this.min, this.max);
    }
    public copy(): IntegerConstantLeaf {
        let n: IntegerConstantLeaf = new IntegerConstantLeaf(this.min, this.max);
        n.value = this.value;
        n.name = "INTEGER CONSTANT(" + n.value + ")";
        n.desc = "" + n.value;

        return n;
    }
}