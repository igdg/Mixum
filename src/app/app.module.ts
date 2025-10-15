import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { PostPage } from '../pages/post/post';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { UsersserviceProvider } from '../providers/usersservice/usersservice';
import { HttpClientModule } from '@angular/common/http';
import { SignupPage } from '../pages/signup/signup';
import { Camera } from '@ionic-native/camera';
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {FIREBASE_CONFIG} from "./app.firebase.config";
import {ProfilePage} from "../pages/profile/profile";
import {PostListService} from "../services/post-list/post-list.service";
import {PostCardComponent} from "../components/post-card/post-card";
import {PostCardFollowComponent} from "../components/post-card-follow/post-card-follow";
import {CommentCardComponent} from "../components/comment-card/comment-card";
import {UserCardComponent} from "../components/user-card/user-card";
import {ForgotPassword} from "../pages/forgot-password/forgot-password";
import {CommentsPage} from "../pages/comments/comments";
import { FollowProvider } from '../providers/follow/follow';
import {FollowingPage} from "../pages/following/following";
import {UsersPage} from "../pages/users/users";


firebase.initializeApp(FIREBASE_CONFIG);
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignupPage,
    PostPage,
    ProfilePage,
    FollowingPage,
    PostCardComponent,
    PostCardFollowComponent,
    ForgotPassword,
    CommentsPage,
    CommentCardComponent,
    UserCardComponent,
    UsersPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignupPage,
    PostPage,
    ProfilePage,
    PostCardComponent,
    PostCardFollowComponent,
    ForgotPassword,
    CommentsPage,
    CommentCardComponent,
    FollowingPage,
    UserCardComponent,
    UsersPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersserviceProvider,
    Camera,
    PostListService,
    FollowProvider,
  ]
})
export class AppModule {}
