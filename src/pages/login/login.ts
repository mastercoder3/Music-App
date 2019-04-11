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
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus';




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
    private auth: AuthProvider, private helper: HelperProvider, private api: ApiProvider,private facebook: Facebook, private afAuth: AngularFireAuth, 
    private gplus: GooglePlus) {

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
                    this.helper.closeLoading();
                    localStorage.setItem('uid', res.user.uid);
                    localStorage.setItem('type', this.user.type);
                    this.navCtrl.setRoot(TabsPage);
                    this.auth.setPersistance();
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
                this.navCtrl.setRoot(TabsPage);
              }
            });
          }, err =>{
            this.helper.closeLoading();
            alert('err')
            alert(err.message);
          });
    },err =>{
      alert('error');
      alert(JSON.stringify(err))
    })

    this.facebook.logEvent(this.facebook.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }


   nativeGoogleLogin(){

    this.gplus.login({})
      .then(res => {
        alert('res');
      }, err =>{
        alert(JSON.stringify(err));
      })

    // return new Promise((resolve, reject) => { 
    //   this.gplus.login({
    //     'webClientId': '335286010691-smljp864en4u29hs5j4jjbhh0ippudcs.apps.googleusercontent.com',
    //     'offline': true
    //   }).then( res => {
    //           const googleCredential = firebase.auth.GoogleAuthProvider
    //               .credential(res.idToken);

    //           firebase.auth().signInWithCredential(googleCredential)
    //         .then( response => {
    //             alert("Firebase success: " + JSON.stringify(response));
    //             resolve(response)
    //         });
    //   }, err => {
    //       alert("Error: " + err)
    //       reject(err);
    //   });
    // });

    // try {
    //   alert('coming');
    //    this.gplus.login({
    //     'webClientId': '335286010691-smljp864en4u29hs5j4jjbhh0ippudcs.apps.googleusercontent.com',
    //     'offline': true,
    //     'scopes': 'profile email'
    //   })
    //   .then(res =>{
    //     alert('yes')
    //     alert(JSON.stringify(res))
    //     const googleCredential = firebase.auth.GoogleAuthProvider
    //     .credential(res.idToken);

    //     firebase.auth().signInWithCredential(googleCredential)
    //     .then( response => {
    //         console.log("Firebase success: " + JSON.stringify(response));
    //         alert(response);
    //     }, err =>{
    //       alert(JSON.stringify(err));
    //     });
    //   }, err => {
    //     alert(JSON.stringify(err))
    //     });
  
  
    // } catch(err) {
    //  alert(err)
    // }
  }

  loginWithGoogle(){
    this.nativeGoogleLogin();
  }


}
