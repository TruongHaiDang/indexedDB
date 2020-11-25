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
  dbName: string = "myApp";
  dbNameTesting: string = "_ionicstorage";
  init_objDB: string[] = ["users", "products"];
  init_keyPath: string[] = ["email", "name"];

  constructor(public indexDB: IndexeddbModuleModule, public router: Router, public toastController: ToastController) {
    this.indexDB.initIndexDB(this.dbName)
                .then((db) => {
                  setTimeout(() => {
                    this.indexDB.getDocsByCursor(db, this.init_objDB[1])
                                .then((ref) => {
                                  console.log(ref);
                                  this.presentToast("Get successfully!");
                                })
                                .catch((err) => {
                                  this.presentToast("Get Fail!");
                                  console.log(err)
                                })
                  }, 1000);
                })
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
    let filter: Array<any> = ((<HTMLInputElement>document.getElementById("name")).value).split(', ');
    this.indexDB.initIndexDB(this.dbName)
                .then((db) => {
                  setTimeout(() => {
                    this.indexDB.getDocs(db, this.init_objDB[1], filter)
                                .then((ref) => {
                                  console.log(ref);
                                  this.presentToast("Get successfully!");
                                })
                                .catch((err) => {
                                  this.presentToast("Get Fail!");
                                  console.log(err)
                                })
                  }, 1000);
                })
  }

  addProduct() {
    let productData: any = {
      name: (<HTMLInputElement>document.getElementById("name")).value,
      quantity: (<HTMLInputElement>document.getElementById("quantity")).value,
      price: (<HTMLInputElement>document.getElementById("price")).value,
    };

    this.indexDB.initIndexDB(this.dbName)
                .then((db) => {
                  setTimeout(() => {
                    this.indexDB.addDocs(db, this.init_objDB[1], productData)
                                .then((ref) => {
                                  this.presentToast("Added successfully!");
                                })
                                .catch((err) => {
                                  this.presentToast("Added Fail!");
                                  console.log(err)
                                })
                  }, 1000);
                })
  }

  updateProduct() {
    let productData: any = {
      name: (<HTMLInputElement>document.getElementById("name")).value,
      quantity: (<HTMLInputElement>document.getElementById("quantity")).value,
      price: (<HTMLInputElement>document.getElementById("price")).value
    };

    this.indexDB.initIndexDB(this.dbName)
                .then((db) => {
                  setTimeout(() => {
                    this.indexDB.updateDocs(db, this.init_objDB[1], productData.name, productData)
                                .then((ref) => {
                                  this.presentToast("Updated successfully!");
                                })
                                .catch((err) => {
                                  this.presentToast("Updated Fail!");
                                  console.log(err)
                                })
                  }, 1000);
                })
  }

  deleteProduct() {
    let name = (<HTMLInputElement>document.getElementById("name")).value;

    this.indexDB.initIndexDB(this.dbName)
                .then((db) => {
                  setTimeout(() => {
                    this.indexDB.deleteDocs(db, this.init_objDB[1], name)
                                .then((ref) => {
                                  this.presentToast("Deleted successfully!");
                                })
                                .catch((err) => {
                                  this.presentToast("Deleted Fail!");
                                  console.log(err)
                                })
                  }, 1000);
                })
    }
  }
