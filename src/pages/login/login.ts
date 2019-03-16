import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { HelperProvider } from '../../providers/helper/helper';
import { ApiProvider } from '../../providers/api/api';
import { TabsPage } from '../tabs/tabs';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,
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
    this.navCtrl.push(SignupPage);
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

  loginByFacebook(){
    this.facebook.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => {
      console.log(res)
      alert(JSON.stringify(res))
    },err =>{
      alert(err)
    })
  }

}
