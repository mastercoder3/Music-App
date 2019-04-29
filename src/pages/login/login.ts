import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { HelperProvider } from '../../providers/helper/helper';
import { ApiProvider } from '../../providers/api/api';
import { TabsPage } from '../tabs/tabs';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import firebase from 'firebase';
import { SignupArtistPage } from '../signup-artist/signup-artist';
import { FbLoginPage } from '../fb-login/fb-login';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';





/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  form: FormGroup;
  user1: Observable<firebase.User>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public modalCtrl: ModalController,
    private menu: MenuController,
    private auth: AuthProvider, private helper: HelperProvider, private api: ApiProvider,private facebook: Facebook, private afAuth: AngularFireAuth) {

      // this.user1 = this.afAuth.authState;
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      password: ['', Validators.required]
    });

  }

  ionViewDidLoad() {
  }

  signup(){
    let myfunc = () => {
      this.navCtrl.push(SignupPage);
    };
    let myfunc1 = () => {
      this.navCtrl.push(SignupArtistPage);
    };
    this.helper.presentActionSheet('Choose an option.','Signup as a Listener','Signup as an Atrist',myfunc,myfunc1);
  }

  user;

  signinCustomer(form){
    this.helper.presentLoadingDefault();
    this.auth.login(form.value.email, form.value.password)
      .then( res =>{
        if(res)
            this.api.getUserById(res.user.uid)
              .subscribe(resp =>{
                  this.user = resp;
                  console.log(resp);
                  if(this.user){
                    if(this.user.type === 'artist' && this.user.isVerified === false){
                      this.helper.closeLoading();
                      this.helper.presentToast('Cannot Login. Please Contact Admin.');
                      this.auth.logout();
                    }
                    else{
                      this.helper.closeLoading();
                    localStorage.setItem('uid', res.user.uid);
                    localStorage.setItem('type', this.user.type);
                    this.navCtrl.setRoot(TabsPage);
                    this.auth.setPersistance();
                    localStorage.setItem('accountType',this.user.premium.type);
                    console.log(this.user.premium.type);
                    this.helper.setAccountType(this.user.premium.type);
                    this.menu.enable(true);
                    }
                    
                  }
                  else{ 
                    this.helper.closeLoading();
                    this.helper.presentToast('Cannot Login.');
                    this.auth.logout();
                  }
              })
      }, err =>{
        this.helper.closeLoading();
        this.helper.presentToast(err.message);
      })
  }

  temp: Array<any>;

  loginByFacebook(){
    this.facebook.login(['public_profile', 'email'])
    .then((res: FacebookLoginResponse) => {
      this.helper.presentLoadingDefault();
      const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(res.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then( success => { 
            this.api.getUserByEmail(success.email)
            .subscribe(res=> {
              this.temp = res;
              if(this.temp.length === 0){
                this.helper.closeLoading();
                // alert(JSON.stringify(success));
                const profileModal = this.modalCtrl.create( FbLoginPage, { data: success });
                // profileModal.onDidDismiss(() => {
                //   this.navCtrl.setRoot(TabsPage);
                // });
                profileModal.present();
              }
              else if(this.temp.length !== 0){
                // alert(JSON.stringify(success));
                this.helper.closeLoading();
                localStorage.setItem('uid', success.uid);
                localStorage.setItem('type', this.temp[0].type);
                localStorage.setItem('logintype','fb');
                localStorage.setItem('accountType',this.temp[0].premium.type);
                this.navCtrl.setRoot(TabsPage);
                this.helper.setAccountType(this.temp[0].premium.type);
                this.menu.enable(true);
              }
            });
          }, err =>{
            this.helper.closeLoading();
            this.helper.presentToast('Failed To Login.');
          });
    },err =>{
      this.helper.presentToast('Failed To Login.');
    })

    this.facebook.logEvent(this.facebook.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }


 


}
