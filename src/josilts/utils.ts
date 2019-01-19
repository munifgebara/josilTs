

export class Utils {



    public static floatRandom(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    public static integerRandom(min: number, max: number) {
        return Math.round(Math.random() * (max - min + 0.999) + min - 0.499);
    }

}