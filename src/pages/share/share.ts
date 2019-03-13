import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { AudioService } from '../../services/AudioService';

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html'
})
export class SharePage {
  constructor(
    public modalService: ModalService,
    public audioService: AudioService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
  }
}
