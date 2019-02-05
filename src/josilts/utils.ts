

export class Utils {
    static resume(exp: string, n: number = 20): string {
        return exp.length < n ? exp : (exp.substr(0, n) + "...");
    }

    public static round(n: number): number {
        return n;
        //return Math.round(n * 100) / 100;
    }

    public static floatRandom(min: number, max: number) {
        return Utils.random() * (max - min) + min;
    }

    public static integerRandom(min: number, max: number) {
        return Math.round(Utils.random() * (max - min + 0.999) + min - 0.499);
    }

    public static indexRandom(array: any[]): number {
        let r = Utils.integerRandom(0, array.length - 1);

        return r;
    }

    public static replaceAll(somestring: string, oldString: string, newString: string): string {
        return somestring.split(oldString).join(newString);
    }


    public static fn(n: any, l: number = 20, d: number = 4): string {
        return ("                    " + n.toFixed(d)).slice(-l);
    }

    static seed = 1234;



    public static random(): number { // doesn't repeat b4 JS dies.
        //return Math.random();
        Utils.seed = Utils.seed * 16807 % 2147483647;
        return (Utils.seed - 1) / 2147483646;
    }

    public static removeCommas(somestring: string): string {
        return somestring.split(",").join("_");
    }


}