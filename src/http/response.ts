import { IncomingMessage, IncomingHttpHeaders } from "http";
import { HttpError } from "./http-error";

export class Response {
    private _data: Promise<Buffer>;
    constructor(private res: IncomingMessage) {
        this._data = new Promise((resolve, reject) => {
            const buffers: Buffer[] = [];
            res.on("data", (chunk) => buffers.push(chunk));
            res.on("error", (err) => reject(HttpError.responseRead(err)));
            res.on("end", () => resolve(Buffer.concat(buffers)));
        });
    }
    statusCode(): number | undefined {
        return this.res.statusCode;
    }
    statusMessage(): string | undefined{
        return this.res.statusMessage;
    }
    headers(): IncomingHttpHeaders {
        return this.res.headers;
    }
    data(): Promise<Buffer> {
        return this._data;
    }
}