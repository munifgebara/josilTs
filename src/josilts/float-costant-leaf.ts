import { Leaf } from "./leaf";
import { Utils } from "./utils";



export class FloatConstantLeaf extends Leaf {

    public value: number;

    constructor(protected min: number, protected max: number) {
        super("FLOAT CONSTANT", "FLOAT", "CONSTANT");
        if (min > max) {
            this.min = max;
            this.max = min;
        }
        this.value = Utils.floatRandom(this.min, this.max);
        this.name += "(" + this.value + ")";
        this.desc = "" + this.value;
    }

    public getValue(): number {
        return this.value;
    }

    public newIntance(): FloatConstantLeaf {
        return new FloatConstantLeaf(this.min, this.max);
    }

    public mudaValue(v: number) {
        this.value = v;
    }

    public copy(): FloatConstantLeaf {
        let n: FloatConstantLeaf = new FloatConstantLeaf(this.min, this.max);
        n.value = this.value;
        n.name = "FLOAT CONSTANT(" + n.value + ")";
        n.desc = "" + n.value;

        return n;
    }

}