import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { HelperProvider } from '../../providers/helper/helper';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the FbLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fb-login',
  templateUrl: 'fb-login.html',
})
export class FbLoginPage {

  form: FormGroup;
  users: Array<any>;
  usernameError: boolean = false;
  error;
  data;
  fbData;
  formFiller: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private fb: FormBuilder, private api: ApiProvider, private helper: HelperProvider) {
    this.fbData = this.navParams.get('data');
    //form init
    this.form = this.fb.group({
      dob: ['', Validators.required],
      city: ['', Validators.required],
      mobile: ['', Validators.required],
      gender: ['male', Validators.required],
      username: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_]*$")])],
    });
    this.helper.presentLoadingDefault();
    // get users
    this.api.getAllUsers()
      .subscribe( res =>{
        this.users = res;
        this.helper.closeLoading();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FbLoginPage');
  }

  submit(form){
    this.data = {
          name: this.fbData.displayName,
          email: this.fbData.email,
          password: '',
          dob: form.value.dob,
          city: form.value.city,
          mobile: form.value.mobile,
          gender: form.value.gender,
          imageURL: this.fbData.photoURL,
          imageId: '',
          username: form.value.username,
          signupType: 'facebook',
          type: 'user'
    }
    this.helper.presentLoadingDefault();
    this.api.createUser(this.fbData.uid, this.data)
    .then(resp =>{
      
      this.formFiller = true;
      localStorage.setItem('uid',this.fbData.uid);
      localStorage.setItem('type',this.data.type);
      localStorage.setItem('logintype','fb');
      this.helper.closeLoading();
      this.viewCtrl.dismiss();
      this.helper.presentToast('Account Created.');
      this.navCtrl.setRoot(TabsPage);
    }, err =>{
      this.formFiller = true;
      this.helper.presentToast(err.message);
      this.helper.closeLoading();
    })
  }

  checkUsername(event){
    let x =[];
    if(event.value.length > 4){
          x = this.users.filter(data => data.username === event.value);
      if(x.length !== 0){
        this.usernameError = true;
        this.error = 'Username Exists, try another one.';
      }
      else{
        this.usernameError = false;
      }
    }
    else{
      this.usernameError = true;
      this.error = 'Username too short.';
    }
  }

  ionViewCanLeave(){
    return this.formFiller;
  }
   

}
