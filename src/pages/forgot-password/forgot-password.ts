import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPassword {

  private email: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, private afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  async forgotPassword(){
    try{
      if(this.email != undefined){
        await this.afAuth.auth.sendPasswordResetEmail(this.email).then(() => {
          this.toastCtrl.create({
            message: `Email para reiniciar contraseña enviado`,
            duration: 3000,
          }).present();
        })
      }else{
        this.toastCtrl.create({
          message: `Debes introducir un email`,
          duration: 3000,
          cssClass: "toastError",
        }).present();
      }
    }catch(err){
      let msj = err.message;
      switch (err.code){
        case "auth/user-not-found":{
          msj = "Usuario no encontrado";
          break;
        }
      }
      this.toastCtrl.create({
        message: msj,
        duration: 3000,
        cssClass: "toastError",
      }).present();
    }
  }

}
