import { FrappeDB } from "$lib/db/index.js";
import { getInstanceWithCredentials, getInstanceWithKeys } from "$lib/utils/axios-config.js";
import type { AxiosInstance } from "axios";
import type { FrappeOptions } from "./types.js";
import { FrappeUpload } from "$lib/file/index.js";

export class Frappe {

    /**
     * The URL of the Frappe instance.
     */
    readonly url: string;
    /**
     * The username to use when authenticating with the Frappe instance.
     */
    readonly username?: string;
    /**
     * The password to use when authenticating with the Frappe instance.
     */
    readonly password?: string;
    /**
     * The API key to use when authenticating with the Frappe instance.
     */
    readonly apiKey?: string;
    /**
     * The secret key to use when authenticating with the Frappe instance.
     */
    readonly secretKey?: string;
    /**
     * Additional headers to include in requests to the Frappe instance.
     */
    readonly headers?: object;
    /**
     * The Axios instance to use when making requests to the Frappe instance.
     */
    instance: AxiosInstance;

    /**
     * Initializes a new instance of the Frappe class.
     *
     * @param {FrappeOptions} options - The options for the Frappe instance.
     */
    constructor(private options: FrappeOptions) {
        this.url = options.url;
        this.username = options.username;
        this.password = options.password;
        this.apiKey = options.apiKey;
        this.secretKey = options.secretKey;
        this.headers = options.headers;
        this.instance = {} as AxiosInstance;
        if (this.apiKey && this.secretKey) {
            this.instance = getInstanceWithKeys(this.url, this.apiKey, this.secretKey, this.headers);
        }
    }

    /**
     * Authenticates the Frappe instance using the provided credentials.
     *
     * @return {Promise<void>} A promise that resolves when the authentication is complete.
     */
    async login() {
        if (this.username && this.password) {
            this.instance = await getInstanceWithCredentials(this.url, this.username, this.password, this.headers);
        } else if (this.apiKey && this.secretKey) {
            throw new Error('You don\'t need to login if you have API key and secret key');
        } else {
            throw new Error('You need to provide username and password or API key and secret key');
        }
    }

    /**
     * Retrieves a FrappeDB instance associated with the current Frappe instance.
     *
     * @return {FrappeDB} A FrappeDB instance.
     */
    db(): FrappeDB {
        return new FrappeDB(this.instance);
    }

    /**
     * Returns the Axios instance that has been configured with the credentials of the Frappe instance.
     *
     * @return {AxiosInstance} The Axios instance that has been configured with the credentials of the Frappe instance.
     */
    client(): AxiosInstance {
        return this.instance;
    }
    /**
     * Returns a FrappeUpload instance associated with the current Frappe instance.
     *
     * @return {FrappeUpload} A Upload instance.
     */

    file(): FrappeUpload {
        return new FrappeUpload(this.instance);
    }
}