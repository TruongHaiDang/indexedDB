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

  constructor(public indexDB: IndexeddbModuleModule, public router: Router, public toastController: ToastController) {

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  getDocs() {
    
  }

  addProduct() {
    let productData: any = {
      name: (<HTMLInputElement>document.getElementById("name")).value,
      quantity: (<HTMLInputElement>document.getElementById("quantity")).value,
      price: (<HTMLInputElement>document.getElementById("price")).value,
    };

    this.indexDB.initIndexDB("myApp", ["products"], ["name"])
                .then((db) => {
                  setTimeout(() => {
                    this.indexDB.addDocs(db, "products", productData)
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
      price: (<HTMLInputElement>document.getElementById("price")).value,
    };

    this.indexDB.initIndexDB("myApp", ["products"], ["name"])
                .then((db) => {
                  setTimeout(() => {
                    this.indexDB.updateDocs(db, "products", "Dao bấm", productData)
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

    this.indexDB.initIndexDB("myApp", ["products"], ["name"])
                .then((db) => {
                  setTimeout(() => {
                    this.indexDB.deleteDocs(db, "products", name)
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
