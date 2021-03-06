import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import Dexie from 'dexie';
import 'dexie-observable';
import 'dexie-syncable';
import '../libs/WebSocketSyncProtocol.js';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class IndexeddbModuleModule { 
  
  /**
   * 
   * 
   * 
   * 
   *                                  THIS AREA USING ORIGINAL INDEXEDDB API
   * 
   * 
   * 
   * 
   */
  db: any; // tạo biến toàn cục để hứng đối tượng được trả về khi kết nối hoặc tạo database
  dbVersion: number = 1;

  /**
   * khởi tạo cơ sở dữ liệu
   * tham số: dbName,
   *          dbVersion - mặc định là 1,
   *          ObjectStoreName - đối tượng chứa dữ liệu,
   *          keyPath: có vai trò như khóa chính hoặc id dùng để dịnh danh và truy vấn dữ liệu,
   *          indexObj: index là các trường trong
   * 
   * ba tham số cuối phải đặt tương ứng
   * vd: dbName - origin
   *      objectStore_1
   *        index1 -> đây là id
   *        index2
   *      objectStore_2
   *        index_1 -> đây là id
   *        index_2
   *        index_3
   * ==> createIndexDB(dbName, dbVersion, [objectStore_1, objectStore_2], [index1, index_1], indexObj: [[index1, index2], [index_1, index_2, index_3]])
   */
  createIndexDB(dbName: string, dbVersion: number, ObjectStoreName: string[], keyPath: string[], indexObj: any[]) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        return;
      }
      this.dbVersion = dbVersion;
      const DBOpenRequest = window.indexedDB.open(dbName, this.dbVersion);

      // onupgradeneeded kích hoạt khi dbVersion thay đổi

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

  /**
   * kết nối tới database cần thao tác, đối tượng được trả về là đại diện database nếu thành công
   * đối tượng trả về sẽ được truyền vào các hàm CRUD 
   */
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
  // Đánh dấu database không thể bị xóa bởi phần mềm, chỉ xóa khi người dùng xóa
  changeToRersistMode() {
    return new Promise((resolve, reject) => {
      navigator.storage.persist().then(function(persistent) {
        console.log("Storage will not be cleared except by explicit user action");
        resolve(true)
      }).catch(function(err) {
        console.log("Storage may be cleared by the UA under storage pressure");
        reject(true)
      })
    })
  }
  /**
   * db là đối tượng được trả về khi gọi hàm initIndexDB() 
   * ObjectStoreName là đối tượng chứa dữ liệu chứa trong database
   */
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
  /**
   * limit là một mảng 5 phần tủ dùng giới hạn dữ liệu khi lọc
   * - limit[0]: bật tắt tính năng, true nếu dùng limit, false nếu không dùng
   * - limit[1], limit[2]: lần lượt là giới hạn trên và dưới
   * - limit[3], limit[4]: thuộc tính lấy biên của giới hạn tương ứng, true nếu lấy luôn giá trị giới hạn
   *    vào tập kết quả
   * direction: điều khiển hướng của cursor. Thông tin tại https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor?redirectlocale=en-US&redirectslug=IndexedDB%2FIDBCursor#Constants
   */
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

  /**
   * 
   * 
   * 
   * 
   *                                  THIS AREA USING DEXIE
   * 
   * 
   * 
   * 
   */

  dexie_createDatabase(dbName: string, dbVersion: number, table: any, upgrade: any) {
      var db = new Dexie(dbName);
      db.version(dbVersion)
        .stores(table)
        .upgrade(tx => {upgrade});
      db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
      });
      return db;
  }

  dexie_syncToServer(db: any, protocol: string, socketUrl: string) {
    db.syncable.connect (protocol, socketUrl);
    db.syncable.on('statusChanged', function (newStatus, url) {
        console.log("Sync Status changed: " + Dexie.Syncable.StatusTexts[newStatus]);
    });
    // db.syncable
  }

  // Users

  dexie_getUsers(db: any, keys: any) {
    return new Promise((resolve, reject) => {
      db.users.where('email').equals(keys.email)
      .toArray()
      .then((result: any) => {
        resolve(result)
      })
      .catch((err: any) => {
        reject(err)
      })
    })
  }

  dexie_createUsers(db: any, data: any) {
    return new Promise((resolve, reject) => {
      db.users.bulkAdd(data)
      .then((result: any) => {
        resolve(result)
      })
      .catch((err: any) => {
        reject(err)
      })
    })
  }

  // Products

  dexie_getDocs(db: any, keys: any[]) {
    return new Promise((resolve, reject) => {
      db.products.bulkGet(keys)
      .then((result: any) => {
        resolve(result)
      })
      .catch((err: any) => {
        reject(err)
      })
    })
  }

  dexie_addDocs(db: any, data: any[]) {
    return new Promise((resolve, reject) => {
      db.products.bulkAdd(data)
      .then((result: any) => {
        resolve(result)
      })
      .catch((err: any) => {
        reject(err)
      })
    })
  }

  dexie_updateDocs(db: any, data: any[]) {
    return new Promise((resolve, reject) => {
      db.products.bulkPut(data)
      .then((result: any) => {
        resolve(result)
      })
      .catch((err: any) => {
        reject(err)
      })
    })
  }

  dexie_deleteDocs(db: any, keys: any[]) {
    return new Promise((resolve, reject) => {
      db.products.bulkDelete(keys)
      .then((result: any) => {
        resolve(result)
      })
      .catch((err: any) => {
        reject(err)
      })
    })
  }

}
