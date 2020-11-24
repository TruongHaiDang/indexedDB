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

  constructor(public indexDB: IndexeddbModuleModule, public router: Router, public toastController: ToastController) { }

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

    this.indexDB.initIndexDB("myApp", ["users"], ["email"]).then((db) => {
      this.indexDB.getDocs(db, "users", userData.email).then((ref: any) => {
        if(ref == undefined) {
          this.presentToast("User doesn't exist!");
        }else if(ref.email == userData.email && ref.password == userData.password) {
          this.presentToast("Login successfully!");
          this.router.navigateByUrl("home");
        }else {
          this.presentToast("Login fail!");
        }
      })
    })
  }
}
