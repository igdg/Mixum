import { Component, ViewChild } from '@angular/core';
import {MenuController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import * as firebase from 'firebase'
import {AngularFireAuth} from 'angularfire2/auth'
import {ProfilePage} from "../pages/profile/profile";
import {FollowingPage} from "../pages/following/following";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private afAuth: AngularFireAuth,
              public menu: MenuController) {
    this.initializeApp();

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Perfil', component: ProfilePage },
      { title: 'Siguiendo', component: FollowingPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.menu.enable(false);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      //this.statusBar.backgroundColorByName('purple');
      this.statusBar.backgroundColorByHexString('#550068');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title == 'Perfil'){
      this.nav.push(page.component, {user_uid: this.afAuth.auth.currentUser.uid});
    }else{
      this.nav.setRoot(page.component);
    }
  }

  logout() {
    this.menu.enable(false);
    this.nav.setRoot(LoginPage);
    this.afAuth.auth.signOut();
  }
}
