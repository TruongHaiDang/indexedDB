export class indexedDB_class {
    request: any;
    db: any;
    constructor(dbName: string, dbVersion: number) {
        this.request = window.indexedDB.open(dbName, dbVersion);
        this.db = null;
    }

    init_object_store(ObjectStoreName) {
        this.request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        this.db.createObjectStore(ObjectStoreName, {
            autoIncrement: true,
            });
        };
    }

    addDocs(ObjectStoreName: string, collection: string, value: any) {
        this.db.transaction(collection, "readwrite")
                .objectStore(ObjectStoreName)
                .add(value);
    }

    getDocs(ObjectStoreName: string, key: any) {
        var request = this.db.transaction(ObjectStoreName)
                                .objectStore(ObjectStoreName)
                                .get(key);
        request.onsuccess = (event) => {
            console.log(`Value is: ${event.target.result}`);
        };
    }

    updateDocs(ObjectStoreName: string, key: any) {
        var objectStore = this.db.transaction(ObjectStoreName, "readwrite")
                                    .objectStore(ObjectStoreName);
        var request = objectStore.get(key);

        request.onsuccess = (event) => {
            var data = event.target.result;
            data.someAttr = true;
            objectStore.put(data, key);
        };
    }

    deleteDocs(ObjectStoreName: string, key: any) {
        this.db.transaction(ObjectStoreName, "readwrite")
                .objectStore(ObjectStoreName)
                .delete(key)
    }
}
