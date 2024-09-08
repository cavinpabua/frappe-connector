import type { AxiosInstance } from "axios"
import type { Filter, FrappeDoc, FrappeDocParams, GetDocListArgs, GetLastDocArgs } from "./types.js";
import type { Error } from '../frappe/types.js';

export class FrappeDB {
    instance: AxiosInstance
    /**
     * Initializes a new instance of the FrappeDB class.
     *
     * @param {AxiosInstance} axios - The Axios instance to use for API requests.
     */
    constructor(axios: AxiosInstance) {
        this.instance = axios
    }

    /**
     * Retrieves a document from the Frappe API.
     *
     * @param {string} doctype - The type of document to retrieve.
     * @param {string} [docname=''] - The name of the document to retrieve. Defaults to an empty string.
     * @return {Promise<FrappeDoc<T>>} A promise that resolves to the retrieved document.
     * @throws {Error} If there was an error while fetching the document.
     */
    async getDoc<T = any>(doctype: string, docname: string = ''): Promise<FrappeDoc<T>> {
        return this.instance
            .get(`/api/resource/${doctype}/${encodeURIComponent(docname)}`)
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: 'There was an error while fetching the document.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                } as Error;
            });
    }

    /**
     * Retrieves a list of documents from the Frappe API.
     *
     * @param {string} doctype - The type of document to retrieve.
     * @param {GetDocListArgs<K>} [args] - Optional arguments to filter the documents.
     * @return {Promise<T[]>} A promise that resolves to the list of retrieved documents.
     * @throws {Error} If there was an error while fetching the documents.
     */
    async getDocList<T = any, K = FrappeDoc<T>>(doctype: string, args?: GetDocListArgs<K>) {
        let params = {};

        if (args) {
            const { fields, filters, orFilters, orderBy, limit, limit_start, groupBy, asDict = true } = args;
            const orderByString = orderBy ? `${String(orderBy?.field)} ${orderBy?.order ?? 'asc'}` : '';
            params = {
                fields: fields ? JSON.stringify(fields) : undefined,
                filters: filters ? JSON.stringify(filters) : undefined,
                or_filters: orFilters ? JSON.stringify(orFilters) : undefined,
                order_by: orderByString,
                group_by: groupBy,
                limit,
                limit_start,
                as_dict: asDict,
            };
        }

        return this.instance
            .get<{ data: T[] }>(`/api/resource/${doctype}`, { params })
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: 'There was an error while fetching the documents.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                } as Error;
            });
    }

    /**
     * Creates a new document in the Frappe API.
     *
     * @param {FrappeDocParams<T>} doc - The document to be created.
     * @return {Promise<FrappeDoc<T>>} A promise that resolves to the created document.
     */
    async createDoc<T = any>(doc: FrappeDocParams<T>): Promise<FrappeDoc<T>> {
        return this.instance
            .post(`/api/resource/${doc.doctype}`, { ...doc })
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: error.response.data.message ?? 'There was an error while creating the document.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                };
            });
    }

    /**
     * Creates multiple documents in the Frappe API.
     *
     * @param {FrappeDocParams<T>[]} docs - An array of document parameters.
     * @return {Promise<FrappeDoc<T>[]>} A promise that resolves to an array of created documents.
     * @throws {Error} If there was an error while creating the documents.
     */
    async createManyDocs<T = any>(docs: FrappeDocParams<T>[]): Promise<FrappeDoc<T>[]> {
        const params = {
            cmd: 'frappe.client.insert_many',
            docs
        }
        return this.instance
            .post(``, { params })
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: error.response.data.message ?? 'There was an error while creating the documents.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                };
            });
    }

    /**
     * Updates a document in the Frappe API.
     *
     * @param {string} doctype - The type of document to update.
     * @param {string | null} docname - The name of the document to update.
     * @param {Partial<T>} value - The updated values for the document.
     * @return {Promise<FrappeDoc<T>>} A promise that resolves to the updated document.
     * @throws {Error} If there was an error while updating the document.
     */
    async updateDoc<T = any>(doctype: string, docname: string | null, value: Partial<T>): Promise<FrappeDoc<T>> {
        return this.instance
            .put(`/api/resource/${doctype}/${docname ? encodeURIComponent(docname) : docname}`, { ...value })
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: error.response.data.message ?? 'There was an error while updating the document.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                };
            });
    }

    /**
     * Updates multiple documents in the Frappe API.
     *
     * @param {FrappeDocParams<T>[]} docs - An array of document parameters.
     * @return {Promise<FrappeDoc<T>[]>} A promise that resolves to an array of updated documents.
     * @throws {Error} If there was an error while updating the documents.
     */
    async updateManyDocs<T = any>(docs: FrappeDocParams<T>[]): Promise<FrappeDoc<T>[]> {
        const params = {
            cmd: 'frappe.client.bulk_update',
            docs
        }
        return this.instance
            .post(``, { params })
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: error.response.data.message ?? 'There was an error while updating the documents.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                };
            });
    }


    /**
     * Submits a document to the Frappe API.
     *
     * @param {string} doctype - The type of the document to be submitted.
     * @param {string} name - The name of the document to be submitted.
     * @return {Promise<FrappeDoc<T>>} A promise that resolves to the submitted document.
     */
    async submitDoc<T = any>(doctype: string, name: string): Promise<FrappeDoc<T>> {
        const params = {
            cmd: 'frappe.client.submit',
            doc: {
                doctype,
                name
            }
        }

        return this.instance
            .post(``, { params })
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: error.response.data.message ?? 'There was an error while submitting the document.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                };
            })
    }

    /**
     * Cancels a document in the Frappe API.
     *
     * @param {string} doctype - The type of document to cancel.
     * @param {string} name - The name of the document to cancel.
     * @return {Promise<FrappeDoc<T>>} A promise that resolves to the cancelled document.
     */
    async cancelDoc<T = any>(doctype: string, name: string): Promise<FrappeDoc<T>> {
        const params = {
            cmd: 'frappe.client.cancel',
            doctype,
            name,
        }

        return this.instance
            .post(``, { params })
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: error.response.data.message ?? 'There was an error while cancelling the document.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                };
            })
    }

    /**
     * Renames a document in the Frappe API.
     *
     * @param {string} doctype - The type of document to rename.
     * @param {string} old_name - The current name of the document to rename.
     * @param {string} new_name - The new name for the document.
     * @return {Promise<FrappeDoc<T>>} A promise that resolves to the renamed document.
     */
    async renameDoc<T = any>(doctype: string, old_name: string, new_name: string): Promise<FrappeDoc<T>> {
        const params = {
            cmd: 'frappe.client.rename_doc',
            doctype,
            old_name,
            new_name,
        }

        return this.instance
            .post(``, { params })
            .then((res) => res.data.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: error.response.data.message ?? 'There was an error while renaming the document.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                };
            })
    }

    /**
     * Deletes a document in the Frappe API.
     *
     * @param {string} doctype - The type of document to delete.
     * @param {string | null} [name] - The name of the document to delete.
     * @return {Promise<{ message: string }>} A promise that resolves to a message indicating the result of the deletion.
     */
    async deleteDoc(doctype: string, name?: string | null): Promise<{ message: string }> {
        return this.instance
            .post('', {
                cmd: "frappe.client.delete",
                doctype,
                name,
            })
            .then((res) => res.data)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: 'There was an error while deleting the document.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                } as Error;
            });
    }

    /**
     * Retrieves the count of documents in the Frappe API.
     *
     * @param {string} doctype - The type of document to retrieve the count for.
     * @param {Filter<T>[]} [filters] - Optional filters to apply to the count retrieval.
     * @param {boolean} [cache=false] - Whether to cache the result.
     * @param {boolean} [debug=false] - Whether to enable debug mode.
     * @return {Promise<number>} A promise that resolves to the count of documents.
     */
    async getCount<T = any>(
        doctype: string,
        filters?: Filter<T>[],
        cache: boolean = false,
        debug: boolean = false,
    ): Promise<number> {
        const params: any = {
            cmd: 'frappe.client.get_count',
            doctype,
            filters: [],
        };

        if (cache) {
            params.cache = cache;
        }

        if (debug) {
            params.debug = debug;
        }
        if (filters) {
            params.filters = filters ? JSON.stringify(filters) : undefined;
        }

        return this.instance
            .get('', { params })
            .then((res) => res.data.message)
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: 'There was an error while getting the count.',
                    exception: error.response.data.exception ?? error.response.data.exc_type ?? '',
                } as Error;
            });
    }

    /**
     * Retrieves the last document of a specified doctype from the Frappe API.
     *
     * @param {string} doctype - The type of document to retrieve the last document for.
     * @param {GetLastDocArgs<FrappeDoc<T>>} [args] - Optional arguments to customize the retrieval.
     * @return {Promise<FrappeDoc<T>>} A promise that resolves to the last document of the specified doctype.
     */
    async getLastDoc<T = any>(doctype: string, args?: GetLastDocArgs<FrappeDoc<T>>): Promise<FrappeDoc<T>> {
        let queryArgs: GetLastDocArgs<FrappeDoc<T>> = {
            orderBy: {
                field: 'creation',
                order: 'desc',
            },
        };
        if (args) {
            queryArgs = {
                ...queryArgs,
                ...args,
            };
        }

        const getDocLists = await this.getDocList<{ name: string }, FrappeDoc<T>>(doctype, { ...queryArgs, limit: 1, fields: ['name'] });
        if (getDocLists.length > 0) {
            return this.getDoc<T>(doctype, getDocLists[0].name);
        }

        return {} as FrappeDoc<T>;
    }
}