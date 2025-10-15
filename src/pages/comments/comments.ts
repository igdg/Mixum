import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Post} from "../../models/Post";
import {Observable} from "rxjs/Observable";
import {AngularFireDatabase} from "angularfire2/database";
import {Comment} from "@angular/compiler";
import {User} from "../../models/User";
import {AngularFireAuth} from "angularfire2/auth";

/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  commentsList$: Observable<Post[]>;
  public comment = {} as Comment;
  post_id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.post_id = this.navParams.get('post_uid');
    this.commentsList$ = this.db.list<Comment>('social/comments/' + this.post_id).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val(),
        }))
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CommentsPage');
  }

  sendComment(comment) {
    if (comment.content != undefined) {
      comment.created_at = new Date().getTime();
      comment.user_id = this.afAuth.auth.currentUser.uid;
      this.afAuth.app.database().ref('social/comments/' + this.post_id).push(comment).then(() => {

      });
    }
  }

}
