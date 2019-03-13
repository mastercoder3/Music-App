import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  Acc_profile: string = 'user';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  
  onSegmentChange(event){
  //   this.form.reset();
  //   if(event === 'All')
  //    this.form.controls['type'].setValue('companies');
  //  else
  //  this.form.controls['type'].setValue('freelancers');

  }

}
