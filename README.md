# frappe-connector

TypeScript svelte library for Frappe Framework backend.

## Installation
If you're seeing this, you've probably already done this step. Congrats!

```bash
npm install @cavinpabua/frappe-connector
```

or

```bash
yarn add @cavinpabua/frappe-connector
```

## Initialising the library

```js
import { Frappe } from '@cavinpabua/frappe-connector';
// Using username and password
const frappe = new Frappe({
    url: 'https://frappe.cloud',
    username: '',
    password: ''
});
await frappe.login() // this is needed since we need to login to get the session-id for user

// Using apiKey and secretKey
const frappe = new Frappe({
    url: 'https://frappe.cloud',
    apiKey: '',
    secretKey: ''
});
```

## Database
#### Initialise the database library

```js
const db = frappe.db();
```

#### Fetch a single document using document name

```js
db.getDoc('DocType', 'document_name')
  .then((doc) => console.log(doc))
  .catch((error) => console.error(error));
```

#### Fetch document list 
```js
db.getDocList('DocType')
  .then((docs) => console.log(docs))
  .catch((error) => console.error(error));
```

You can also add more options to filter the list

```js
db.getDocList('DocType', {
  /** Fields to be fetched */
  fields: ['name', 'creation'],
  /** Filters to be applied - SQL AND operation */
  filters: [['creation', '>', '2021-10-09']],
  /** Filters to be applied - SQL OR operation */
  orFilters: [],
  /** Fetch from nth document in filtered and sorted list. Used for pagination  */
  limit_start: 5,
  /** Number of documents to be fetched. Default is 20  */
  limit: 10,
  /** Sort results by field and order  */
  orderBy: {
    field: 'creation',
    order: 'desc',
  },
  /** Group the results by particular field */
  groupBy: 'name',
  /** Fetch documents as a dictionary */
  asDict: false,
})
  .then((docs) => console.log(docs))
  .catch((error) => console.error(error));
```

#### Get count of document  with filters

```js
const filters = [['creation', '>', '2021-10-09']];
const useCache = true; /** Default is false - Optional **/
const debug = false; /** Default is false - Optional **/

db.getCount('DocType', filters, cache, debug)
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Get Last Doc (Latest document to be inserted)

```js
db.getLastDoc('My Doctype')
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

Optionally, you can have your own filter for the last doc

```js
db.getLastDoc('My Doctype', {
    filters?: Filter<T>[];
    orFilters?: Filter<T>[];
    orderBy?: {
        field: keyof T | (string & Record<never, never>);
        order?: 'asc' | 'desc';
    };
})
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Create Document

```js
const params = {
  doctype: "My Doctype",
  field_1: "test",
  field_2: "test"
}

db.createDoc(params)
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Create Documents in Bulk

```js
const doc1 = {
  doctype: "My Doctype",
  field_1: "test",
  field_2: "test"
}
const doc2 = {
  doctype: "My Doctype",
  field_1: "test",
  field_2: "test"
}
const arrayOfDocs = [doc1, doc2]

db.createManyDocs(arrayOfDocs)
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Update a Document

```js
const values = {
  field_1: "updates this field",
  field_2: "updates this field"
}

db.updateDoc("My Doctype", "doc_name", {
  ...values
})
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Update Documents in bulk

```js
const doc1 = {
  doctype: "My Doctype",
  field_1: "test",
  field_2: "test"
}
const doc2 = {
  doctype: "My Doctype",
  field_1: "test",
  field_2: "test"
}
const arrayOfDocs = [doc1, doc2]

db.updateManyDocs(arrayOfDocs)
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Delete a Document

```js
db.deleteDoc("My Doctype", "doc_to_delete")
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Submit a Document if submittable

```js
db.submitDoc("My Doctype", "name_of_doc_to_submit")
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Cancel a submitted Document

```js
db.cancelDoc("My Doctype", "name_of_doc_to_cancel")
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

#### Rename a Document

```js
db.renameDoc("My Doctype", "old_name", "new_name")
  .then((count) => console.log(count))
  .catch((error) => console.error(error));
```

## FrappeUpload


```js
const file = frappe.file();
```

#### Uploading a file with onProgress

```js
const myFile; //Your File object

const fileArgs = {
  "isPrivate": true,
  /** Folder the file exists in (optional) */
  "folder": "Home",
  /** File URL (optional) */
  "file_url": "",
  /** Doctype associated with the file (optional) */
  "doctype": "User",
  /** Docname associated with the file (mandatory if doctype is present) */
  "docname": "Administrator",
  /** Field in the document **/
  "fieldname": "image"
}

file.uploadFile(
            myFile,
            fileArgs,
            /** Progress Indicator callback function **/
            (completedBytes, totalBytes) => console.log(Math.round((completedBytes / totalBytes) * 100), " completed")
        )
        .then(() => console.log("File Upload complete"))
        .catch(e => console.error(e))
```

## Axios instance

If you want to use the axios instance for any requests you want.
This instance will have the credentials initiated in the Frappe constructor.

```js
const instance: AxiosInstance = frappe.client()
```

#### You can use it like a regular axios instance

```js
// Like a normal Axios GET method
const searchParams = {
  doctype: 'Users',
  txt: 'Cavin',
};
instance
  .get('frappe.desk.search_link', searchParams)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```