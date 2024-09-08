export interface FrappeOptions {
    url: string;
    username?: string;
    password?: string;
    apiKey?: string;
    secretKey?: string;
    headers?: object;
}

export interface Error {
    httpStatus: number;
    httpStatusText: string;
    message: string;
    exception: string;
    exc?: string;
    exc_type?: string;
    _server_messages?: string;
}
