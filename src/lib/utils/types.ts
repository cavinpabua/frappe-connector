
export interface HeadersConfig {
    'Accept'?: string
    'Content-Type'?: string
    'X-Frappe-Site-Name'?: string
    'X-Frappe-CSRF-Token'?: string
    'Authorization'?: string
    'Cookie'?: string
    [key: string]: string | undefined
}