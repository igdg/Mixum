import {Component} from '@angular/core';
import {
  ActionSheetController, IonicPage, NavController, NavParams, Platform, ToastController,
  ViewController
} from 'ionic-angular';
import {UsersserviceProvider} from '../../providers/usersservice/usersservice';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FormGroup} from "@angular/forms";
import * as firebase from 'firebase'
import storage = firebase.storage;
import {Profile} from "../../models/Profile";
import {Post} from "../../models/Post";
import {AngularFireAuth} from "angularfire2/auth";
import {HomePage} from "../home/home";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  form: FormGroup;
  image: string = null;
  post = {} as Post;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public camera: Camera,
              public platform: Platform, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
              private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad PostPage');
  }

  dismiss() {
    let data = {'foo': 'bar'};
    this.viewCtrl.dismiss(data);
  }

  pressSelectPhoto() {
    /*const options: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };*/
    if (this.platform.is('cordova')) {
      this.actionSheetCtrl.create({
        title: 'Escoger una fotografía desde...',
        buttons: [
          {
            text: 'Cámara',
            icon: 'camera',
            handler: () => {
              //this.photoFromCamera().then(imgData => this.form.controls['photo'].setValue(imgData));
              this.photoFromCamera();
            }
          },
          {
            text: 'Galería',
            icon: 'images',
            handler: () => {
              // this.photoFromLibrary().then(imgData => this.form.controls['photo'].setValue(imgData));
              this.photoFromLibrary();
            }
          }, {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      }).present();
    }
  }

  /*async photoFromCamera() {
    try {
      const result = await this.camera.getPicture({sourceType: this.camera.PictureSourceType.CAMERA});
      this.image = `data:image/jpeg;base64,${result}`;
      const pictures = storage().ref('pictures/' + new Date().getTime());
      pictures.putString(this.image, 'data_url');
    } catch (err) {
      console.log(err)
    }
  }*/

  photoFromCamera() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 600,
      targetHeight: 600,
      quality: 100
    };
    let that = this;
    that.camera.getPicture(options)
      .then(imageData => {
        that.post.image = `data:image/jpeg;base64,${imageData}`;
        const pictures = storage().ref('pictures/' + new Date().getTime());
        pictures.putString(that.post.image, 'data_url');
      })
      .catch(error => {
        console.error(error);
      });
  }

  photoFromLibrary() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 600,
      targetHeight: 600,
      quality: 100
    }
    let that = this;
    that.camera.getPicture(options)
      .then(imageData => {
        that.post.image = `data:image/jpeg;base64,${imageData}`;
        const pictures = storage().ref('pictures/' + new Date().getTime());
        pictures.putString(that.post.image, 'data_url');
      })
      .catch(error => {
        console.error(error);
      });
  }

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 600,
      targetHeight: 600,
      quality: 100
    }

    this.camera.getPicture(options)
      .then(imageData => {
        this.image = `data:image/jpeg;base64,${imageData}`;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async sendPost() {
    let post = this.post;
    if (post.content != undefined && post.image != undefined) {

      //this.afDatabase.object(`social/posts/`).set(post).then(() => this.navCtrl.setRoot(HomePage))
      this.afAuth.authState.take(1).subscribe(auth => {
        post.user_id = auth.uid;
        let time = -new Date().getTime();
        post.created_at = time;
        this.afAuth.app.database().ref('social/posts').push().set(post).then(() => this.dismiss());
      });

    } else {
      this.toastCtrl.create({
        message: `Hay campos vacíos`,
        duration: 3000
      }).present();
    }
  }

  /*async photoFromLibrary() {
    try {
      const result = await this.camera.getPicture({sourceType: this.camera.PictureSourceType.PHOTOLIBRARY});
      this.image = `data:image/jpeg;base64,${result}`;
      const pictures = storage().ref('pictures/' + new Date().getTime());
      pictures.putString(this.image, 'data_url');
    } catch (err) {
      console.log(err)
    }
  }*/

}
