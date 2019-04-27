import { Component } from '@angular/core';
import { Platform, App, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { AudioService } from '../services/AudioService';
import firebase  from 'firebase';
import { HelperProvider } from '../providers/helper/helper';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private auth: AuthProvider,
    private audio: AudioService,
    private app: App,
    private helper: HelperProvider,
    private menu: MenuController
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
  }

  logout(){
    localStorage.removeItem('uid');
    localStorage.clear();
    this.auth.logout();
    this.audio.destroyMusicControls();
    this.app.getRootNav().setRoot(LoginPage);
    this.menu.close();
    this.menu.enable(false);
  }

  USER;


  resetPassword(){

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
}
