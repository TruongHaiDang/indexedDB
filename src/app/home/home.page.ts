import { Component } from '@angular/core';
import { IndexeddbModuleModule } from '../indexeddb-module/indexeddb-module.module'
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  db: any;
  dbName: string = "myApp";
  dbNameTesting: string = "_ionicstorage";
  init_objDB: string[] = ["users", "products"];
  init_keyPath: string[] = ["email", "name"];
  keyRange: any[] = [true, "f", "q", false, false];

  constructor(
      public indexDB: IndexeddbModuleModule, 
      public router: Router, 
      public toastController: ToastController
    ) {
    // this.indexDB.initIndexDB(this.dbName)
    //             .then((db) => {
    //               this.indexDB.getDocsByCursor(db, this.init_objDB[1], this.keyRange, "prev")
    //               .then((ref) => {
    //                 console.log("Search by cursor" + ref);
    //                 this.presentToast("Get successfully!");
    //               })
    //               .catch((err) => {
    //                 this.presentToast("Get Fail!");
    //                 console.log(err)
    //               })
    //             })

    // this.indexDB.initIndexDB(this.dbName).then((db) => {
    //   this.indexDB.getDocsByIndex(db, "users", "name", "le duc huy")
    //               .then((ref) => {
    //                 console.log("Search by index" + ref)
    //               })
    // })

    this.db = this.indexDB.dexie_createDatabase("myApp", 1, {
      users: `$$_id, email, name`,
      products: `$$_id, name, quantity, price`
    }, {})
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  getProduct() {
    let filter: Array<any> = ((<HTMLInputElement>document.getElementById("_id")).value).split(', ');
    // this.indexDB.initIndexDB(this.dbName)
    //             .then((db) => {
    //               this.indexDB.getDocs(db, this.init_objDB[1], filter)
    //                             .then((ref) => {
    //                               console.log("Search by keyPath" + ref);
    //                               this.presentToast("Get successfully!");
    //                             })
    //                             .catch((err) => {
    //                               this.presentToast("Get Fail!");
    //                               console.log(err)
    //                             })
    //             })

    this.indexDB.dexie_getDocs(this.db, filter).then(result => console.log(result))
  }

  addProduct() {
    let productData: any = {
      name: (<HTMLInputElement>document.getElementById("name")).value,
      quantity: (<HTMLInputElement>document.getElementById("quantity")).value,
      price: (<HTMLInputElement>document.getElementById("price")).value,
    };

    // this.indexDB.initIndexDB(this.dbName)
    //             .then((db) => {
    //               this.indexDB.addDocs(db, this.init_objDB[1], productData)
    //               .then((ref) => {
    //                 this.presentToast("Added successfully!");
    //               })
    //               .catch((err) => {
    //                 this.presentToast("Added Fail!");
    //                 console.log(err)
    //               })
    //             })

    this.indexDB.dexie_addDocs(this.db, [productData]).then(result => console.log(result))
  }

  updateProduct() {
    let productData: any = {
      _id: (<HTMLInputElement>document.getElementById("_id")).value,
      name: (<HTMLInputElement>document.getElementById("name")).value,
      quantity: (<HTMLInputElement>document.getElementById("quantity")).value,
      price: (<HTMLInputElement>document.getElementById("price")).value
    };

    // this.indexDB.initIndexDB(this.dbName)
    //             .then((db) => {
    //               this.indexDB.updateDocs(db, this.init_objDB[1], productData.name, productData)
    //                             .then((ref) => {
    //                               this.presentToast("Updated successfully!");
    //                             })
    //                             .catch((err) => {
    //                               this.presentToast("Updated Fail!");
    //                               console.log(err)
    //                             })
    //             })

    this.indexDB.dexie_updateDocs(this.db, [productData]).then(result => console.log(result))
  }

  deleteProduct() {
    let filter: Array<any> = ((<HTMLInputElement>document.getElementById("_id")).value).split(', ');

    // this.indexDB.initIndexDB(this.dbName)
    //             .then((db) => {
    //               this.indexDB.deleteDocs(db, this.init_objDB[1], name)
    //               .then((ref) => {
    //                 this.presentToast("Deleted successfully!");
    //               })
    //               .catch((err) => {
    //                 this.presentToast("Deleted Fail!");
    //                 console.log(err)
    //               })
    //             })

    this.indexDB.dexie_deleteDocs(this.db, filter).then(result => console.log(result))
    }
  }
