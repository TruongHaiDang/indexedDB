import { Component, OnInit } from '@angular/core';
import { IndexeddbModuleModule } from '../indexeddb-module/indexeddb-module.module'
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  db: any;
  dbName: string = "myApp";
  dbVerssion: number = 1;
  init_objDB: string[] = ["users", "products"];
  init_keyPath: string[] = ["email", "name"];
  indexObj: any[] = [["name", "email"], ["name", "quantity", "price"]]

  constructor(public indexDB: IndexeddbModuleModule, public router: Router, public toastController: ToastController) { 
    // this.indexDB.createIndexDB(this.dbName, this.dbVerssion, this.init_objDB, this.init_keyPath, this.indexObj)
    //             .then(() => {
    //               this.indexDB.changeToRersistMode().then((ref) => {})
    //             })

    this.db = this.indexDB.dexie_createDatabase("myApp", 1, {
      users: `$$_id, email, name`,
      products: `$$_id, name, quantity, price`
    }, {})
  }

  ngOnInit() {
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  login() {
    let userData: any = {
      email: (<HTMLInputElement>document.getElementById("email")).value,
      password: (<HTMLInputElement>document.getElementById("password")).value,
    };

    // this.indexDB.initIndexDB(this.dbName).then((db) => {
    //   this.indexDB.getDocs(db, this.init_objDB[0], [userData.email]).then((ref) => {
    //     if(ref[0] == undefined) {
    //       this.presentToast("User doesn't exist!");
    //     }else if(ref[0].email == userData.email && ref[0].password == userData.password) {
    //       this.presentToast("Login successfully!");
    //       this.router.navigateByUrl("home");
    //     }else {
    //       this.presentToast("Login fail!");
    //     }
    //   })
    // })

    this.indexDB.dexie_getUsers(this.db, userData).then(result => {
      if(result[0].email == userData.email && result[0].password == userData.password) {
        this.router.navigateByUrl("home");
      }
    })
  }
}
