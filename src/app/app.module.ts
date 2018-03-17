import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase'
import { UsersserviceProvider } from '../providers/usersservice/usersservice';
import { HttpClientModule } from '@angular/common/http';
import { SignupPage } from '../pages/signup/signup';


  // Initialize Firebase
  export const config = {
    apiKey: "AIzaSyCtjrS6vM6O_JZWDPKbHE1d2dO7U-J2fKw",
    authDomain: "proyecto-653da.firebaseapp.com",
    databaseURL: "https://proyecto-653da.firebaseio.com",
    projectId: "proyecto-653da",
    storageBucket: "proyecto-653da.appspot.com",
    messagingSenderId: "839778730245"
  };
  firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersserviceProvider
  ]
})
export class AppModule {}
