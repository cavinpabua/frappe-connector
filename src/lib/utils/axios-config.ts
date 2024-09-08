import axios, { type AxiosInstance } from "axios";

export async function getInstanceWithCredentials(url: string, username?: string, password?: string, headers?: object): Promise<AxiosInstance> {
    const res = await axios.post(url + '/api/method/login', {
        'usr': username,
        'pwd': password
    }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
    if (res.status === 200) {
        const cookies = res.headers['set-cookie'];
        const sidCookie = cookies?.find(cookie => cookie.startsWith('sid='));
        if (sidCookie) {
            return axios.create({
                baseURL: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cookie': sidCookie,
                    ...headers
                }
            });
        }
    }
    throw new Error(`Failed to login to ${url}`);
}

export function getInstanceWithKeys(url: string, apiKey?: string, secretKey?: string, headers?: object): AxiosInstance {
    return axios.create({
        baseURL: url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `token ${apiKey}:${secretKey}`,
            ...headers
        },
        withCredentials: true
    })
}

