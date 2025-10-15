import { Component, Input, OnInit } from '@angular/core';
import {UsersserviceProvider} from "../../providers/usersservice/usersservice";
import {AngularFireAuth} from "angularfire2/auth";
import {ProfilePage} from "../../pages/profile/profile";
import {NavController} from "ionic-angular";

/**
 * Generated class for the CommentCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'comment-card',
  templateUrl: 'comment-card.html'
})
export class CommentCardComponent implements OnInit{
  @Input()
  item: any;
  content: string;
  user: any;
  profile: any;

  constructor(public userProvider: UsersserviceProvider, private afAuth: AngularFireAuth, public navCtrl: NavController) {
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

    /*let that = this;

    Object.keys(this.item).forEach(key=> {
      console.log(this.item[key])  ;
    });*/
  }

  openProfile(user_id: string) {
    this.navCtrl.push(ProfilePage, {user_uid: user_id});
  }

}
