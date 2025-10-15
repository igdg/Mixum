import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

/*
  Generated class for the FollowProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FollowProvider {

  constructor(public http: HttpClient, private db: AngularFireDatabase) {
  }

  getFollowers(userId: string){
    return this.db.object(`social/followers/${userId}`)
  }

  getFollowing(followerId: string, followedId: string){
    return this.db.object(`social/following/${followerId}/${followedId}`)
  }

  getFollowingC(followerId: string){
    return this.db.object(`social/following/${followerId}`)
  }

  follow(followerId: string, followedId: string){
    this.db.object(`social/followers/${followedId}`).update({[followerId]: true})
    this.db.object(`social/following/${followerId}`).update({[followedId]: true})
  }


  unfollow(followerId: string, followedId: string){
    this.db.object(`social/followers/${followedId}/${followerId}`).remove()
    this.db.object(`social/following/${followerId}/${followedId}`).remove()
  }

}
