import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

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

  songs;
  index;

  constructor(
    private modalCtrl: ModalController,
    public modalService: ModalService,
    public audioService: AudioService,
    private params: NavParams,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService
  ) {
    this.songs = this.params.get('songs');
    this.index = this.params.get('index');
  }

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

  changeSeeker(event){
    let val = this.audioService.progressPercentage();
    if(event.value > val){
      let seeker = (event.value * this.audioService.playingTrack().duration ) / 100;
      this.audioService.seekTo(seeker);
    }
    else if (event.value < val){
      let seeker = (event.value * this.audioService.playingTrack().duration ) / 100;
      this.audioService.seekTo(seeker);
    }

    if(event.value === 100){
      setTimeout( ()=>{
        this.next();
      }, 500);
    }
      
  }
}
