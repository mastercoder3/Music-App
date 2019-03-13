import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { AudioService } from '../../services/AudioService';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { SharePage } from '../share/share';
import { OptionsPage } from '../options/options';

import { Song } from '../../data/Song';

@IonicPage()
@Component({
  selector: 'page-music-player',
  templateUrl: 'music-player.html'
})
export class MusicPlayerPage {
  constructor(
    private modalCtrl: ModalController,
    public modalService: ModalService,
    public audioService: AudioService,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MusicPlayerPage');
  }

  share() {
    const modal = this.modalCtrl.create(SharePage);
    modal.present();
  }

  options() {
    const modal = this.modalCtrl.create(OptionsPage);
    modal.present();
  }

  previous() {
    this.audioService.previous();
    this.musicPlayerPageService.setUpNextSongs();
  }

  next() {
    this.audioService.next();
    this.musicPlayerPageService.setUpNextSongs();
  }

  changeSong(song: Song) {
    this.musicPlayerPageService.simplePlaySong(song);
  }
}
