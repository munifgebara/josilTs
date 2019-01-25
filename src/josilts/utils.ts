

export class Utils {

    public round(n: number): number {
        return Math.round(100 * n) / 100;
    }



    public static floatRandom(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    public static integerRandom(min: number, max: number) {
        return Math.round(Math.random() * (max - min + 0.999) + min - 0.499);
    }

    public static indexRandom(array: any[]): number {
        let r = Utils.integerRandom(0, array.length - 1);

        return r;
    }

}