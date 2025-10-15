import {Component} from '@angular/core';
import {
  NavController, ToastController, Platform, ActionSheetController, ModalController,
  MenuController
} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {PostPage} from '../post/post';
import * as firebase from 'firebase'
import {FormGroup} from "@angular/forms";
import {Camera} from '@ionic-native/camera';
import {AngularFireAuth} from 'angularfire2/auth'
import {User} from "../../models/User";
import {Profile} from "../../models/Profile";
import {ProfilePage} from "../profile/profile";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {AngularFireObject} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Post} from "../../models/Post";
import {PostListService} from "../../services/post-list/post-list.service";

@Component({
  selector: 'page-following',
  templateUrl: 'following.html'
})
export class FollowingPage {
  form: FormGroup;
  //profileData: Observable<{}>;
  profileData: AngularFireObject<Profile>;
  private user: User;
  postsList$: Observable<Post[]>;
  private post: Array<{}>;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public platform: Platform,
              public actionSheetCtrl: ActionSheetController, public camera: Camera, public modalCtrl: ModalController,
              private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, private posts: PostListService,
              public menu: MenuController) {


    this.menu.enable(true);
    this.postsList$ = this.posts.getPostList()
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val(),
        }))
      })
  }

  ionViewWillLoad() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        let that = this;
        this.afAuth.app.database().ref(`social/profile/${data.uid}`).on("value", function (profileF) {
          that.profileData = profileF.val();
        });
      }
    })
  }

  logout() {
    this.menu.enable(false);
    this.afAuth.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  ira() {
    this.navCtrl.push(ProfilePage, {user_uid: this.afAuth.auth.currentUser.uid})
  }

  doRefresh(refresher) {
    this.postsList$ = this.posts.getPostList()
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val(),
        }))
      })
    refresher.complete();
  }

  presentPostModel() {
    let postModal = this.modalCtrl.create(PostPage, this.profileData);
    postModal.onDidDismiss(data => {
      //console.log(data);
    });
    postModal.present();
  }

}
