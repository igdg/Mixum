import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import {AngularFireDatabase} from "angularfire2/database";

/*
  Generated class for the UsersserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class UsersserviceProvider {

  public data: any;
  public fireAuth: any;
  public userProfile: any;

  constructor(public http: HttpClient, private afDatabase: AngularFireDatabase) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('social/users')
  }

  loginUserService(email: string, password: string): any{
    return this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  getUser(uid?: string) {
    return this.afDatabase.database.ref('social/profile/'+ uid).once('value').then(function(snapshot) {
      return snapshot.val();
    });
  }

  signupUserService(account: {}){
    return this.fireAuth.createUserWithEmailAndPassword(account["email"], account["password"]).then((newUser) => {
      this.fireAuth.signInWithEmailAndPassword(account["email"], account["password"]).then((authenticatedUser) => {
        this.userProfile.child(authenticatedUser.uid).set(
          account
        );
      });
    });
  }

  logoutService(){
    return this.fireAuth.signOut();
  }

}
