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
  dbName: string = "myApp";
  dbVerssion: number = 1;
  init_objDB: string[] = ["users", "products"];
  init_keyPath: string[] = ["email", "name"];

  constructor(public indexDB: IndexeddbModuleModule, public router: Router, public toastController: ToastController) { 
    this.indexDB.createIndexDB(this.dbName, this.dbVerssion, this.init_objDB, this.init_keyPath)
                .then(() => {

                })
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

    this.indexDB.initIndexDB(this.dbName, this.init_objDB[0], this.init_keyPath[0]).then((db) => {
      this.indexDB.getDocs(db, this.init_objDB[0], [userData.email]).then((ref) => {
        if(ref[0] == undefined) {
          this.presentToast("User doesn't exist!");
        }else if(ref[0].email == userData.email && ref[0].password == userData.password) {
          this.presentToast("Login successfully!");
          this.router.navigateByUrl("home");
        }else {
          this.presentToast("Login fail!");
        }
      })
    })
  }
}
