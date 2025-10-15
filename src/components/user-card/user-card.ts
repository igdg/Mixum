import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {UsersserviceProvider} from "../../providers/usersservice/usersservice";
import {ProfilePage} from "../../pages/profile/profile";
import {NavController} from "ionic-angular";

/**
 * Generated class for the UserCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-card',
  templateUrl: 'user-card.html'
})
export class UserCardComponent implements OnInit {

  @Input()
  item: any;
  profile: any;
  user: any;

  constructor(private afAuth: AngularFireAuth, public userProvider: UsersserviceProvider, public navCtrl: NavController) {
  }

  ngOnInit() {
    this.user = this.userProvider.getUser(this.item.key);
    let that = this;
    this.afAuth.app.database().ref(`social/profile/${this.item.key}`).on("value", function (profileF) {
      that.profile = profileF.val();
    });
  }

  openProfile(user_id: string) {
    this.navCtrl.push(ProfilePage, {user_uid: user_id});
  }

}
