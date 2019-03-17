import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public modalCtrl: ModalController,
    private auth: AuthProvider, private helper: HelperProvider, private api: ApiProvider,private facebook: Facebook) {
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
                  if(this.user){
                    this.helper.closeLoading();
                    localStorage.setItem('uid', res.user.uid);
                    localStorage.setItem('type', this.user.type);
                    this.navCtrl.setRoot(TabsPage);
                  }
                  else
                    this.helper.closeLoading();
              })
      }, err =>{
        this.helper.closeLoading();
        this.helper.presentToast(err.message);
      })
  }

  temp: Array<any>;

  loginByFacebook(){
    this.facebook.login(['public_profile', 'user_friends', 'email'])
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
                const profileModal = this.modalCtrl.create( FbLoginPage, { data: success });
                // profileModal.onDidDismiss(() => {
                //   this.navCtrl.setRoot(TabsPage);
                // });
                profileModal.present();
              }
              else if(this.temp.length !== 0){
                this.helper.closeLoading();
                localStorage.setItem('uid', success.uid);
                localStorage.setItem('type', this.temp[0].type);
                this.navCtrl.setRoot(TabsPage);
              }
            });
          }, err =>{
            this.helper.closeLoading();
            alert(err);
          });
    },err =>{
      alert(err)
    })
  }

}
