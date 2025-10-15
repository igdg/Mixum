import {Component, Input, OnInit} from '@angular/core';
import {ActionSheetController, App, ModalController, NavController, NavParams} from "ionic-angular";
import {UsersserviceProvider} from "../../providers/usersservice/usersservice";
import {AngularFireAuth} from "angularfire2/auth";
import {ProfilePage} from "../../pages/profile/profile";
import {AngularFireDatabase} from "angularfire2/database";
import {CommentsPage} from "../../pages/comments/comments";
import {FollowProvider} from "../../providers/follow/follow";

@Component({
  selector: 'post-card-follow',
  templateUrl: 'post-card-follow.html'
})
export class PostCardFollowComponent implements OnInit {

  @Input()
  item: any;
  user: any;
  profile: any;
  likes: any;
  comments: any;
  countLikes: number = 0;
  myLike: boolean;
  commentsCount: number = 0;
  following = [];

  constructor(public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController,
              public userProvider: UsersserviceProvider,
              public app: App,
              private afAuth: AngularFireAuth,
              public navCtrl: NavController,
              private afDatabase: AngularFireDatabase,
              private followSvc: FollowProvider,
              public navParams: NavParams) {
  }

  ngOnInit() {
    this.user = this.userProvider.getUser(this.item.user_id);
    let that = this;
    this.afAuth.app.database().ref(`social/profile/${this.item.user_id}`).on("value", function (profileF) {
      that.profile = profileF.val();
      /*if(that.profileData == undefined){
        that.navCtrl.setRoot(ProfilePage);
      }*/
    });
    this.afAuth.app.database().ref(`social/likes/` + this.item.key).on("value", function (likes) {
      that.likes = likes.val();
      if (that.likes) {
        that.countLikes = Object.keys(that.likes).length;
        Object.keys(that.likes).forEach(function (item) {
          if (item == that.afAuth.auth.currentUser.uid) {
            that.myLike = true;
          }
        })
      }
    });

    this.afAuth.app.database().ref(`social/comments/` + this.item.key).on("value", function (comments) {
      that.comments = comments.val();
      if(that.comments){
        that.commentsCount = Object.keys(that.comments).length;
      }
    });

    //Followers
    this.followSvc.getFollowingC(this.afAuth.auth.currentUser.uid).valueChanges()
      .subscribe(following =>{
        if(following){
          let a;
          if(this.following != null){
            a = this.following.indexOf(Object.keys(following))
          }
          if(a==-1){
            this.following.push(Object.keys(following)[0])
          }
        }
      })
  }

  openProfile(user_id: string) {
    this.navCtrl.push(ProfilePage, {user_uid: user_id});
  }

  like(user_id: string, post_id: string) {
    let that = this;
    this.afAuth.app.database().ref('social/likes/' + post_id + '/' + this.afAuth.auth.currentUser.uid).once("value", function (lik) {
      if (lik.val()) {
        //elimino
        that.afAuth.app.database().ref('social/likes/' + post_id + '/' + that.afAuth.auth.currentUser.uid).remove().then((v) => {
          that.myLike = undefined;
        });

      } else {
        //Lo creo
        that.afAuth.app.database().ref('social/likes/' + post_id + '/' + that.afAuth.auth.currentUser.uid).set(true);
      }
      /*if(that.profileData == undefined){
        that.navCtrl.setRoot(ProfilePage);
      }*/
    })
    //let likeRef = this.afAuth.app.database().ref('social/likes').push();
    //likeRef.set({post_id: post_id});
    //console.log(likeRef)
    //this.afDatabase.database.ref('social/profile/' + this.afAuth.auth.currentUser.uid + "/feeds/likes").update({like_id: likeRef});
    //Hay que guardarlo en un array, recogerlo y modificarlo.
    //Guardar el nº de likes en el post
    //this.afDatabase.database.ref('social/profile/' + this.afAuth.auth.currentUser.uid + "/feeds/likes").update({like_id: likeRef.key});
  }

  verComentarios(post_uid) {
    this.navCtrl.push(CommentsPage, {post_uid: post_uid});
  }

}
