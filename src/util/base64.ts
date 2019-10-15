export class Base64 {

    static preencoded(value: string): Base64 {
        // TODO: check the value actually is valid base64
        return new Base64(value);
    }

    static encode(value: string): Base64 {
        return new Base64(Buffer.from(value, 'binary').toString('base64'));
    }

    private constructor(private base64value: string) { }

    toJSON() {
        return this.base64value;
    }
}