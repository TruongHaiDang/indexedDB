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
  dbName: string = "myApp";
  init_objDB: string[] = ["users", "products"];
  init_keyPath: string[] = ["email", "name"];

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
    this.indexDB.initIndexDB(this.dbName, this.init_objDB[0], this.init_keyPath[0]).then((db) => {
      setTimeout(() => {
        this.indexDB.addDocs(db, this.init_objDB[0], userData)
                    .then((ref) => {
                      this.presentToast("SignUp successfully!");
                      this.router.navigateByUrl("login")
                    })
                    .catch((err) => {
                      this.presentToast("Fail to signup!");
                      console.log(err)
                    })
      }, 1000);
    })
  }
}
