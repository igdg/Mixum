import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase'

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

  constructor(public http: HttpClient) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('users')  
  }

  loginUserService(email: string, password: string): any{
    return this.fireAuth.signInWithEmailAndPassword(email, password)
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

}
