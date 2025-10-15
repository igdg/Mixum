import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Post} from "../../models/Post";
import {Observable} from "rxjs/Observable";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  title: string;
  user_id: string;
  followersList$: Observable<Post[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase) {
    this.title = navParams.get('title');
    this.user_id = navParams.get('user_uid');
    if(this.title === 'Seguidores'){
      this.followersList$ = this.db.list<Post>('social/followers/'+this.user_id)
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val(),
          }))
        });
    }else{
      this.followersList$ = this.db.list<Post>('social/following/'+this.user_id)
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val(),
          }))
        });
    }

  }

  ionViewDidLoad() {
  }

}
