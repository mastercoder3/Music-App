import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { VideoService } from '../../services/VideoService';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  type;

  constructor(
    private videoService: VideoService,
    private modalCtrl: ModalController
  ) {
    this.type = localStorage.getItem('type');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter HomePage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }
  }

  openSearch() {
    const modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }
}
