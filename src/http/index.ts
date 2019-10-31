import { Agent as HttpsAgent, request, RequestOptions } from "https";
import { parse } from "url";
import { HttpError } from "./http-error";

import { Response } from "./response";
export { Response } from "./response";

function get_port(port: string | undefined, default_: number): number {
    if (port === undefined) {
        return default_;
    }
    const port_num = parseInt(port, 10);
    if (isNaN(port_num) || port_num < 1 || port_num > 65535) {
        throw HttpError.invalidPort(port);
    }
    return port_num;
}

function parse_server_root(server_root: string) {
    const url_parts = parse(server_root);
    if (url_parts.protocol !== "https:") {
        throw HttpError.unsupportedProtocol(server_root);
    }
    if (url_parts.auth) {
        throw HttpError.basicAuth();
    }
    if (url_parts.path !== "/") {
        throw HttpError.pathIncluded(server_root);
    }
    if (url_parts.search) {
        throw HttpError.queryIncluded(server_root);
    }
    if (url_parts.hash) {
        throw HttpError.hashIncluded(server_root);
    }
    return url_parts;
}

export class Api {
    static new({ server_root, cacert, client_cert, client_key }: {
        server_root: string,
        cacert: Uint8Array | Buffer | string,
        client_cert: Uint8Array | Buffer | string,
        client_key: Uint8Array | Buffer | string,
    }): Api {
        // https://nodejs.org/docs/latest/api/url.html#url_url
        const url_parts = parse_server_root(server_root);
        return new Api(new HttpsAgent({
            ca: cacert as any || [],
            host: url_parts.hostname,
            port: get_port(url_parts.port, 443),
            cert: client_cert as any,
            key: client_key as any,
            keepAlive: true,
        }));
    }

    constructor(private agent: HttpsAgent) { }

    private req(options: RequestOptions, data?: Uint8Array | Buffer | string): Promise<Response> {
        return new Promise((resolve, reject) => {
            const opts = Object.assign({}, { agent: this.agent }, options);
            const req = request(opts, (res) => resolve(new Response(res)));
            req.on("error", (err) => reject(HttpError.request(err)));
            if (data === undefined) {
                req.end();
                return;
            }
            req.write(data, (err) => {
                if (err) {
                    reject(HttpError.requestWrite(err))
                } else {
                    req.end();
                }
            });
        });
    }

    async get(path: string): Promise<Response> {
        return this.req({ method: "GET", path });
    }
    async head(path: string): Promise<Response> {
        return this.req({ method: "HEAD", path });
    }
    async post(path: string, data: Uint8Array | Buffer | string): Promise<Response> {
        return this.req({ method: "POST", path }, data);
    }
}
