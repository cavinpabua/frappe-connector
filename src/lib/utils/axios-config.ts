import axios, { type AxiosInstance } from "axios";
import type { HeadersConfig } from "./types.js";

/**
 * Creates an instance of Axios with the provided URL and credentials.
 *
 * @param {string} url - The base URL for the Axios instance.
 * @param {string} [username] - The username for authentication.
 * @param {string} [password] - The password for authentication.
 * @param {object} [headers] - Additional headers to include in the Axios instance.
 * @return {Promise<AxiosInstance>} A promise that resolves to the created Axios instance.
 * @throws {Error} If the login to the URL fails.
 */
export async function getInstanceWithCredentials(url: string, username?: string, password?: string, headers?: object): Promise<AxiosInstance> {
    const res = await axios.post(url + '/api/method/login', {
        'usr': username,
        'pwd': password
    }, {
        headers: {
            ...getCommonHeaders(url, headers),
        } as HeadersConfig
    })
    if (res.status === 200) {
        const cookies = res.headers['set-cookie'];
        const sidCookie = cookies?.find(cookie => cookie.startsWith('sid='));
        if (sidCookie) {
            return axios.create({
                baseURL: url,
                headers: {
                    'Cookie': sidCookie,
                    ...getCommonHeaders(url, headers),
                } as HeadersConfig,
            });
        }
    }
    throw new Error(`Failed to login to ${url}`);
}

/**
 * Creates an instance of Axios with the provided URL and authentication keys.
 *
 * @param {string} url - The base URL for the Axios instance.
 * @param {string} [apiKey] - The API key for authentication.
 * @param {string} [secretKey] - The secret key for authentication.
 * @param {object} [headers] - Additional headers to include in the Axios instance.
 * @return {AxiosInstance} The created Axios instance.
 */
export function getInstanceWithKeys(url: string, apiKey?: string, secretKey?: string, headers?: object): AxiosInstance {
    return axios.create({
        baseURL: url,
        headers: {
            'Authorization': `token ${apiKey}:${secretKey}`,
            ...getCommonHeaders(url, headers),
        } as HeadersConfig,
        withCredentials: true
    })
}

/**
 * Returns a set of common headers to be used in API requests.
 *
 * @param {string} baseURL - The base URL of the API.
 * @param {object} [customHeaders] - Custom headers to be merged with the common headers.
 * @return {HeadersConfig} The common headers.
 */
export function getCommonHeaders(baseURL: string, customHeaders?: object): HeadersConfig {
    const headers: HeadersConfig = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...customHeaders
    }
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        if (baseURL && baseURL === window.location.origin) {
            headers['X-Frappe-Site-Name'] = window.location.hostname
        }
    }
    if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
        headers['X-Frappe-CSRF-Token'] = window.csrf_token
    }
    return headers
}