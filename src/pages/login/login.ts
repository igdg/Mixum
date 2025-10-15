import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ToastController, MenuController} from 'ionic-angular';
import { HomePage } from '../home/home';
import { UsersserviceProvider } from '../../providers/usersservice/usersservice'
import { SignupPage } from '../signup/signup';
import { ForgotPassword } from '../forgot-password/forgot-password';
import {AngularFireAuth} from 'angularfire2/auth'
import {User} from "../../models/User";
import {errorHandler} from "@angular/platform-browser/src/browser";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UsersserviceProvider]
})
export class LoginPage {

  public user = {} as User;
  passeye:string ='eye';
  constructor(public usersService: UsersserviceProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth, public menu: MenuController) {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User){
    try{
      if(user.email!=undefined && user.password!=undefined){
        const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
        if(result){
          this.navCtrl.setRoot(HomePage);
          this.menu.enable(true);
        }
      }else{
        this.toastCtrl.create({
          message: `Hay campos vacíos`,
          duration: 3000,
          cssClass: "toastError",
        }).present();
      }
    }catch(err){
      let msj = err.message;
      switch (err.code){
        case "auth/invalid-email":{
          msj = "Correcto eléctronico inálido";
          break;
        }
        case "auth/wrong-password":{
          msj = "Datos incorrectos";
          break;
        }
        case "auth/user-not-found": {
          msj = "Datos incorrectos";
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

  forgotPassword(){
    this.navCtrl.push(ForgotPassword)
  }

  register(){
    this.navCtrl.push(SignupPage)
  }
}
