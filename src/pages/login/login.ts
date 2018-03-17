import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase'
import { HomePage } from '../home/home';
import { UsersserviceProvider } from '../../providers/usersservice/usersservice'
import { SignupPage } from '../signup/signup';

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

  public email: string;
  public password: string;

  constructor(public usersService: UsersserviceProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
    this.email = "email"
    this.password = "pass"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  submitLogin(){
    var that = this;

    var loader = this.loadingCtrl.create({
      content: "Espera por favor..."
    });
    loader.present();

    this.usersService.loginUserService(this.email, this.password).then(authData => {
      //correcto
      loader.dismiss();
      that.navCtrl.setRoot(HomePage);
    }, error => {
      loader.dismiss();
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      that.password = ""
    });
  }

  forgotPassword(){

  }

  redirectToSignup(){
      this.navCtrl.push(SignupPage)
  }

}
