import { Component, OnInit } from '@angular/core';
import { IndexeddbModuleModule } from '../indexeddb-module/indexeddb-module.module';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(public indexDB: IndexeddbModuleModule, public router: Router, public toastController: ToastController) { 

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

  register() {
    let userData: any = {
      name: (<HTMLInputElement>document.getElementById("userName")).value,
      email: (<HTMLInputElement>document.getElementById("email")).value,
      password: (<HTMLInputElement>document.getElementById("password")).value
    }
    this.indexDB.initIndexDB("myApp", ["users", "products"], ["email", "name"]).then((db) => {
      setTimeout(() => {
        this.indexDB.addDocs(db, "users", userData)
                    .then((ref) => {
                      this.presentToast("SignUp successfully!");
                      setTimeout(() => this.router.navigateByUrl("login"), 1000)
                    })
                    .catch((err) => {
                      this.presentToast("Fail to signup!");
                      console.log(err)
                    })
      }, 2000);
    })
  }
}
