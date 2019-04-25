import { Component } from '@angular/core';
import { ModalController, MenuController } from 'ionic-angular';

import { VideoService } from '../../services/VideoService';
import { SearchPage } from '../search/search';
import { StartPopupPage } from '../start-popup/start-popup';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  type;
  popup;

  constructor(
    private videoService: VideoService,
    private modalCtrl: ModalController,
    private api: ApiProvider, private menu: MenuController
  ) {
    this.type = localStorage.getItem('type');
    this.api.getPopUp()
    .subscribe(ress =>{
      this.popup = ress;
      console.log(ress);
      if(this.popup.status === 'active'){
         const modal = this.modalCtrl.create(StartPopupPage, {
          data: this.popup.imageURL
        });
        modal.present();
      }
       
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter HomePage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    this.menu.enable(true);

 
  }

  openSearch() {
    const modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }
}
