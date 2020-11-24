import { element } from 'protractor';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getMaxListeners } from 'process';
import { type } from 'os';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class IndexeddbModuleModule { 
  db: any;
  dbVersion: number = 1;

  initIndexDB(dbName: string, ObjectStoreName: string[], keyPath: string[]) {
    return new Promise((resolve, reject) => {
      const DBOpenRequest = window.indexedDB.open(dbName, this.dbVersion);
      DBOpenRequest.onupgradeneeded = (event: any) => {
        let db = event.target.result;
        db.onerror = function(event: any) {
          reject(event)
        };
        for(let i = 0; i < ObjectStoreName.length; i++) {
          db.createObjectStore(ObjectStoreName[i], {keyPath: keyPath[i]});
        }
        
        // objectStore.createIndex("email", "email", { unique: false });
        resolve(db);
      };
      DBOpenRequest.onsuccess = (event: any) => {
        this.db = DBOpenRequest.result;
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

  getDocsByCursor(db: any, ObjectStoreName: string) {
    return new Promise((resolve, reject) => {
      let list: string[] = [];
      var objectStore = db.transaction(ObjectStoreName, "readwrite")
              .objectStore(ObjectStoreName)
      objectStore.openCursor().onsuccess = function(event: any) {
        var cursor = event.target.result;
        if (cursor) {
          list.push(cursor.value);
          cursor.continue();
          resolve(list)
        }
      };
    })
  }
}
