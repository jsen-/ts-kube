export class HttpError extends Error {
    cause?: Error;

    static unsupportedProtocol(url: string): HttpError {
        return new HttpError(`Unsupported protocol in url "${url}". Only HTTPS is supported.`);
    }
    static basicAuth(): HttpError {
        return new HttpError(`Basic auth is not supported`);
    }
    static pathIncluded(url: string): HttpError {
        return new HttpError(`Server root url may not contain path, got "${url}"`);
    }
    static queryIncluded(url: string): HttpError {
        return new HttpError(`Server root url may not contain query, got "${url}"`);
    }
    static hashIncluded(url: string): HttpError {
        return new HttpError(`Server root url may not contain hash, got "${url}"`);
    }
    static invalidPort(port: string): HttpError {
        return new HttpError(`Invalid port number "${port}"`);
    }
    static requestWrite(cause: Error): HttpError {
        return new HttpError(`Error writing request`, cause);
    }
    static request(cause: Error): HttpError {
        return new HttpError(`Request error`, cause);
    }
    static responseRead(cause: Error): HttpError {
        return new HttpError(`Error reading response`, cause);
    }

    private constructor(message: string, cause?: Error) {
        super(message);
        this.cause = cause;
    }
}