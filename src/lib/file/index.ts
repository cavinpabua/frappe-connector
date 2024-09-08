import type { AxiosInstance, AxiosProgressEvent } from 'axios';

import type { Error } from '../frappe/types.js';
import type { FileArgs } from './types.js';

export class FrappeUpload {
    /** Axios instance */
    readonly axios: AxiosInstance;

    constructor(
        axios: AxiosInstance,
    ) {
        this.axios = axios;
    }

    /**
     * Upload file to database
     * @param {File} file to be uploaded
     * @param {@type FileArgs} args arguments of the file
     * @param {VoidFunction} onProgress file upload progress
     * @returns Promise which resolves with the file object
     */
    async upload<T = any>(file: File, args: FileArgs<T>, onProgress?: (bytesUploaded: number, totalBytes?: number, progress?: AxiosProgressEvent) => void, apiPath: string = 'upload_file') {
        const formData = new FormData();
        if (file) formData.append('file', file, file.name);

        const { isPrivate, folder, file_url, doctype, docname, fieldname, otherData } = args;

        if (isPrivate) {
            formData.append('is_private', '1');
        }
        if (folder) {
            formData.append('folder', folder);
        }
        if (file_url) {
            formData.append('file_url', file_url);
        }
        if (doctype && docname) {
            formData.append('doctype', doctype);
            formData.append('docname', docname);
            if (fieldname) {
                formData.append('fieldname', fieldname);
            }
        }

        if (otherData) {
            Object.keys(otherData).forEach((key: string) => {
                const v = otherData[key as keyof T] as any;
                formData.append(key, v);
            });
        }

        return this.axios
            .post(`/api/method/${apiPath}`, formData, {
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        onProgress(progressEvent.loaded, progressEvent.total, progressEvent);
                    }
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            .catch((error) => {
                throw {
                    ...error.response.data,
                    httpStatus: error.response.status,
                    httpStatusText: error.response.statusText,
                    message: error.response.data.message ?? 'There was an error while uploading the file.',
                    exception: error.response.data.exception ?? '',
                } as Error;
            });
    }
}
