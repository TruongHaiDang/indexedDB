import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class IndexeddbModuleModule { 
  db: any;
  dbVersion: number = 1;

  createIndexDB(dbName: string, dbVersion: number, ObjectStoreName: string[], keyPath: string[], indexObj: any[]) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      }
      this.dbVersion = dbVersion;
      const DBOpenRequest = window.indexedDB.open(dbName, this.dbVersion);
      DBOpenRequest.onupgradeneeded = (event: any) => {
        let db = event.target.result;
        db.onerror = function(event: any) {
          reject(event)
        };
        for(let i = 0; i < ObjectStoreName.length; i++) {
          var objectStore = db.createObjectStore(ObjectStoreName[i], {keyPath: keyPath[i]});
          for(let j = 0; j < indexObj[i].length; j++) {
            objectStore.createIndex(indexObj[i][j], indexObj[i][j], { unique: false });
          }
        }
        resolve(db);
      };
      DBOpenRequest.onblocked = function(event) {
        alert("Please close all other tabs with this site open!");
      };
      DBOpenRequest.onsuccess = (event: any) => {
        this.db = DBOpenRequest.result;
        this.db.onversionchange = function() {
          this.db.close();
          alert("Database is outdated, please reload the page.")
        };
        resolve(this.db);
      };
      
      DBOpenRequest.onerror = function(event: any) {
        reject(event.target.errorCode);
      }
    })
  }

  initIndexDB(dbName: string) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      }
      const DBOpenRequest = window.indexedDB.open(dbName, this.dbVersion);
      DBOpenRequest.onsuccess = (event: any) => {
        this.db = DBOpenRequest.result;
        this.db.onversionchange = function() {
          this.db.close();
          alert("Database is outdated, please reload the page.")
        };
        resolve(this.db);
      };
      
      DBOpenRequest.onerror = function(event: any) {
        reject(event.target.errorCode);
      }
    })
  }

  addDocs(db: any, ObjectStoreName: string, value: any) {
    return new Promise((resolve, reject) => {
      let request = db.transaction(ObjectStoreName, "readwrite")
              .objectStore(ObjectStoreName)
              .add(value);
      request.onsuccess = function(event: any) {
        resolve(event.target.result);
      };
      
      request.onerror = function(event: any) {
        reject(event.target.errorCode);
      }
    })
  }

  getDocs(db: any, ObjectStoreName: string, key: any[]) {
    return new Promise((resolve, reject) => {
      let result: string[] = [];
      for(let i = 0; i < key.length; i++){
          var request = db.transaction(ObjectStoreName)
                                .objectStore(ObjectStoreName)
                                .get(key[i]);
          request.onsuccess = (event: any) => {
            result.push(event.target.result)
            if(i == key.length - 1) resolve(result);
        };
      }
    })
  }

  updateDocs(db: any, ObjectStoreName: string, key: any, value: any) {
    return new Promise((resolve, reject) => {
      var objectStore = db.transaction(ObjectStoreName, "readwrite")
                                  .objectStore(ObjectStoreName);
      var request = objectStore.get(key);
      request.onsuccess = (event: any) => {
          var data = event.target.result;
          data = value;
          objectStore.put(data);
          resolve(true);
      };
    })
  }

  deleteDocs(db: any, ObjectStoreName: string, key: any) {
    return new Promise((resolve, reject) => {
      db.transaction(ObjectStoreName, "readwrite")
              .objectStore(ObjectStoreName)
              .delete(key);
      resolve(true);
    })
  }

  getDocsByCursor(db: any, ObjectStoreName: string, limit: any[5] = [], direction: string = "next") {
    return new Promise((resolve, reject) => {
      let list: string[] = [], keyRange: any;
      limit[0] ? (keyRange = IDBKeyRange.bound(limit[1], limit[2], limit[3], limit[4])) : null;
      var objectStore = db.transaction(ObjectStoreName)
              .objectStore(ObjectStoreName)
      objectStore.openCursor(keyRange, direction).onsuccess = function(event: any) {
        var cursor = event.target.result;
        if (cursor) {
          list.push(cursor.value);
          cursor.continue();
          resolve(list)
        }
      };
    })
  }

  getDocsByIndex(db: any, ObjectStoreName: string, indexName: string, key: string) {
    return new Promise((resolve, reject) => {
      let list: string[] = [];
      var objectStore = db.transaction(ObjectStoreName)
              .objectStore(ObjectStoreName)
      var index = objectStore.index(indexName);
      index.get(key).onsuccess = function(event: any) {
        resolve(event.target.result)
      };
    })
  }
}
