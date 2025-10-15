import {Component} from '@angular/core';
import {IonicPage, NavController, LoadingController, ToastController, NavParams} from 'ionic-angular';
import {User} from "../../models/User";
import {AngularFireAuth} from 'angularfire2/auth'
import {Profile} from "../../models/Profile";
import {ProfilePage} from "../profile/profile";
import {HomePage} from "../home/home";
import {AngularFireDatabase} from "angularfire2/database";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public user = {} as User;
  private repeatPass: string;
  profile = {} as Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController, private afAuth: AngularFireAuth,
              private afDatabase: AngularFireDatabase) {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SignupPage');
  }

  async register(user: User) {
    try {
      /*const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then((newUser) => {
        user.password = '';
        this.afAuth.app.database().ref('social/users').child(newUser.uid).set(
          user
        );
      });*/
      if (user.email != undefined && user.password != undefined && this.repeatPass != undefined && this.profile.username != undefined &&
          this.profile.firstName != undefined && this.profile.lastName != undefined) {
        if(this.repeatPass === user.password){
          let that = this;
          await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(() => {
            that.afAuth.authState.take(1).subscribe(auth => {
              that.afDatabase.object(`social/profile/${auth.uid}`).set(this.profile)
                .then(() => this.navCtrl.setRoot(HomePage))
            })
          });
        }else{
          this.toastCtrl.create({
            message: `Las contraseñas no coinciden`,
            duration: 3000,
            cssClass: "toastError",
          }).present();
        }
      } else {
        this.toastCtrl.create({
          message: `Hay campos vacíos`,
          duration: 3000,
          cssClass: "toastError",
        }).present();
      }
    } catch (err) {
      let msj = err.message;
      switch (err.code) {
        case "auth/invalid-email": {
          msj = "Correcto eléctronico inálido";
          break;
        }
        case "auth/wrong-password": {
          msj = "Datos incorrectos";
          break;
        }
        case "auth/weak-password": {
          msj = "La contraseña debe tener al menos 6 carateres";
          break;
        }
        case "auth/email-already-in-use": {
          msj = "El correo electrónico ya está en uso";
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
