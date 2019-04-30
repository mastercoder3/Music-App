import { Component, ViewChild } from '@angular/core';
import { Platform, App, MenuController, NavController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { AudioService } from '../services/AudioService';
import firebase  from 'firebase';
import { HelperProvider } from '../providers/helper/helper';
import { CardSelectionPage } from '../pages/card-selection/card-selection';
import { SeeAllPage } from '../pages/see-all/see-all';
import { ApiProvider } from '../providers/api/api';
import { Subscription } from 'rxjs';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  user;
  @ViewChild(Nav) nav;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private auth: AuthProvider,
    private audio: AudioService,
    private app: App,
    private helper: HelperProvider,
    private menu: MenuController,
    private api: ApiProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.rootPage = LoginPage;


    if(localStorage.getItem('uid')){
      this.rootPage = TabsPage;
    }
    else{
      this.rootPage = LoginPage;
    }
    this.getData();
  }

  $ob: Subscription;

  getData(){
  this.$ob=    this.api.getUserById(localStorage.getItem('uid'))
      .subscribe(res =>{
        this.user = res;
      });
  }

  logout(){
    this.$ob.unsubscribe();
    this.user =null;
    localStorage.removeItem('uid');
    localStorage.clear();
    this.auth.logout();
    this.audio.destroyMusicControls();
    this.app.getRootNav().setRoot(LoginPage);
    this.menu.close();
    this.menu.enable(false);
  }

  buy(){
    this.menu.close();

    this.nav.push(CardSelectionPage);
  }

  USER;


  resetPassword(){
    this.menu.close();

    let func = (data) => {
        firebase.auth().onAuthStateChanged( user => {
          if (user){
            this.USER = user;
            console.log(user)
          user.updatePassword(data.password)
            .then(res => {
              this.helper.presentToast('Password Updated');
            }, err =>{
              console.log('Error while updating password');
            })
          } else {
              console.log(user)
          }
        });

    }
    let x =    this.helper.showPassword(func);
    x.present();


  }

  liked(){
    this.menu.close();

    this.nav.push(SeeAllPage,{
      type: 'liked'
    })
  }

  offline(){
    this.menu.close();
    this.nav.push(SeeAllPage,{
      type: 'offline'
    })
  }
}
