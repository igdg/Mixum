import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { UsersserviceProvider } from '../../providers/usersservice/usersservice'
import * as firebase from 'firebase'
import { HomePage } from '../home/home';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [UsersserviceProvider]
})
export class SignupPage {

  public email: string;
  public password: string;
  public name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public usersserviceProvider: UsersserviceProvider, 
    public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  doSignup(){
    var   account = {
      name: this.name,
      email: this.email,
      password: this.password,
    };
    var that = this;

    var loader = this.loadingCtrl.create({
      content: "Espera por favor",     
    });
    loader.present();

  	this.usersserviceProvider.signupUserService(account).then(authData => {
  		//successful
  		loader.dismiss();
  		that.navCtrl.setRoot(HomePage);

  	}, error => {
    loader.dismiss();
     // Unable to log in
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      that.password = ""
  	}); 
  }
}
