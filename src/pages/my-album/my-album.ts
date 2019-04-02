import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ModalService } from '../../services/ModalService';
import { HelperProvider } from '../../providers/helper/helper';

/**
 * Generated class for the MyAlbumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-album',
  templateUrl: 'my-album.html',
})
export class MyAlbumPage implements OnInit {

  data;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider, private helper: HelperProvider, private modal: ModalService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAlbumPage');
  }

  ngOnInit(){
    this.data = this.navParams.get('data');
    console.log(this.data);
  }

  close(){
    this.modal.dismiss();
  }

}
