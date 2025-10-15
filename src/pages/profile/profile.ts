import {Component, OnInit} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {Profile} from "../../models/Profile";
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from "firebase";
import {HomePage} from "../home/home";
import {Camera, CameraOptions} from "@ionic-native/camera";
import storage = firebase.storage;
import {Post} from "../../models/Post";
import {Observable} from "rxjs/Observable";
import {PostListService} from "../../services/post-list/post-list.service";
import {FollowProvider} from "../../providers/follow/follow";
import {UsersPage} from "../users/users";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit{

  profile = {} as Profile;
  mostrar = false;
  postsList$: Observable<Post[]>;
  following: number;
  //followers: null;
  isFollowing = null;
  followerCount: number;
  userId = this.navParams.get('user_uid');
  currentUserId = this.afAuth.auth.currentUser.uid;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,
              private afDatabase: AngularFireDatabase, public camera: Camera, public platform: Platform,
              public actionSheetCtrl: ActionSheetController, private posts: PostListService,
              private followSvc: FollowProvider, public toastCtrl: ToastController) {

    let that = this;
    if(this.navParams.get('user_uid') != undefined){
      this.postsList$ = this.posts.getPostListUser(this.navParams.get('user_uid'))
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val(),
          }))
        });
    }else{
      this.postsList$ = this.posts.getPostListUser(this.afAuth.auth.currentUser.uid)
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val(),
          }))
        });
    }

    if(this.navParams.get('user_uid') != undefined){

      this.afDatabase.database.ref('social/profile/'+ this.navParams.get('user_uid')).once('value').then(function(snapshot) {
        that.profile = snapshot.val();
      });
      if(this.navParams.get('user_uid') == this.afAuth.auth.currentUser.uid){
        this.mostrar = true;
      }
    }else{
      this.afDatabase.database.ref('social/profile/'+ this.afAuth.auth.currentUser.uid).once('value').then(function(snapshot) {
        that.profile = snapshot.val();
      });
      this.mostrar = true;
    }

  }

  ngOnInit(){
    //Check if current user is following this user
    //this.following = this.followSvc.getFollowing(this.navParams.get('user_uid'), this.afAuth.auth.currentUser.uid).valueChanges()
    this.followSvc.getFollowing(this.afAuth.auth.currentUser.uid, this.navParams.get('user_uid')).valueChanges()
      .subscribe(following =>{
        this.isFollowing = following
      })

    this.followSvc.getFollowingC(this.userId).valueChanges()
      .subscribe(following =>{
        this.following = this.countFollowers(following)
      })

    //this.followers = this.followSvc.getFollowers(this.afAuth.auth.currentUser.uid).valueChanges()
    this.followSvc.getFollowers(this.navParams.get('user_uid')).valueChanges()
      .subscribe(followers =>{
        this.followerCount = this.countFollowers(followers);
      })
  }

  countFollowers(followers){
    if(followers === null){
      return 0;
    }else{
      return Object.keys(followers).length;
    }
  }

  toggleFollow(){
    //const userId = this.navParams.get('user_uid');
    //const currentUserId = this.afAuth.auth.currentUser.uid;

    if(this.isFollowing){
      this.isFollowing = false;
      this.followSvc.unfollow(this.currentUserId, this.userId)
    }else{
      this.isFollowing = true;
      this.followSvc.follow(this.currentUserId, this.userId)
    }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
  }

  createProfile(){
    this.afAuth.authState.take(1).subscribe(auth => {
      this.afDatabase.object(`social/profile/${auth.uid}`).set(this.profile)
        .then(() => this.navCtrl.setRoot(HomePage))
    })
  }

  changeImage(){
    if(this.navParams.get('user_uid') == this.afAuth.auth.currentUser.uid){
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
  }

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
        that.profile.photo = `data:image/jpeg;base64,${imageData}`;
        const pictures = storage().ref('profile/' + new Date().getTime());
        pictures.putString(that.profile.photo, 'data_url');
        //UPDATE Y EN EL OTRO TAMBIEN
        that.afDatabase.database.ref('social/profile/' + that.afAuth.auth.currentUser.uid).update({photo: that.profile.photo});
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
        that.profile.photo = `data:image/jpeg;base64,${imageData}`;
        const pictures = storage().ref('profile/' + new Date().getTime());
        pictures.putString(that.profile.photo, 'data_url');
        that.afDatabase.database.ref('social/profile/' + that.afAuth.auth.currentUser.uid).update({photo: that.profile.photo});
      })
      .catch(error => {
        console.error(error);
      });
  }

  viewFollowers(){
    this.navCtrl.push(UsersPage, {user_uid: this.navParams.get('user_uid'), title: 'Seguidores'});
  }

  viewFollowing(){
    this.navCtrl.push(UsersPage, {user_uid: this.navParams.get('user_uid'), title: 'Siguiendo'});
  }

  save(profile){
    if((profile.username != '' && profile.firstName != '' && profile.lastName != '') && (profile.username != undefined && profile.firstName != undefined && profile.lastName != undefined)){
      this.afDatabase.database.ref('social/profile/' + this.afAuth.auth.currentUser.uid).update(
        {
            username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName
        }
        );
      this.toastCtrl.create({
        message: `Datos guardados`,
        duration: 3000
      }).present();
    }else {
      this.toastCtrl.create({
        message: `Hay campos vacíos`,
        duration: 3000,
        cssClass: "toastError",
      }).present();
    }
  }

}
