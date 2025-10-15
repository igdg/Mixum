import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Post} from "../../models/Post";

@Injectable()
export class PostListService{

  private postListRef = this.db.list<Post>('social/posts', ref=>ref.limitToLast(100).orderByChild('created_at'));

  constructor(private db: AngularFireDatabase){

  }

  getPostList(){
    return this.postListRef;
  }

  getPostListUser(user_id){
    return this.db.list<Post>('social/posts', ref=>ref.orderByChild('user_id').equalTo(user_id));
  }

  /*getPostListFollowing(){
    return this.db.list<Post>('social/posts', ref=>ref.orderByChild('user_id').equalTo(user_id));
  }*/

  addPost(post: Post){
  }
}
