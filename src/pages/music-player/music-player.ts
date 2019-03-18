import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { AudioService } from '../../services/AudioService';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { SharePage } from '../share/share';
import { OptionsPage } from '../options/options';

import { Song } from '../../data/Song';
import { HelperProvider } from '../../providers/helper/helper';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-music-player',
  templateUrl: 'music-player.html'
})
export class MusicPlayerPage {

  songs;
  index;
  count = 0;
  time;
  adSong: Array<any> = [];
  ads;
  isActive= false;

  constructor(
    private modalCtrl: ModalController,
    public modalService: ModalService,
    public audioService: AudioService,
    private params: NavParams,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService,
    private helper: HelperProvider,
    private api: ApiProvider
  ) {
    this.songs = this.params.get('songs');
    this.index = this.params.get('index');
    localStorage.removeItem('count');
    localStorage.removeItem('timer');
    localStorage.setItem('adStatus', 'inactive');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MusicPlayerPage');  
    this.getData();
    this.resetTime();
  }

  getData(){
    this.api.getAds()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.ads = res;
        })
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
    if(localStorage.getItem('adStatus') === 'active' && this.count !== 0){
      this.play()
    }
    else{

      if(localStorage.getItem('adStatus') === 'inactive'){
        this.audioService.previous();
        this.musicPlayerPageService.setUpNextSongs();
      }
      this.setAds();
    }

  }

  next() {
    if(localStorage.getItem('adStatus') === 'active' && this.count !== 0){
      this.play()
    }
    else{

      if(localStorage.getItem('adStatus') === 'inactive'){
        this.audioService.next();
        this.musicPlayerPageService.setUpNextSongs();
      }
      this.setAds();
    }

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

  flagSongs;
  flagIndex;
  allSongs;

  play(){
    this.isActive = true;
    this.adSong.push(this.ads[0]);
    this.updateAds(this.ads[0]);
    this.flagSongs = this.musicPlayerPageService.allSongs;
    this.flagIndex = this.audioService.trackIndex;
    this.musicPlayerPageService.playAd(this.adSong,0);
    this.resetTime();
    setTimeout( () =>{
      this.isActive = false;
      localStorage.setItem('adStatus','changed')
    }, 10000);
  }

  setAds(){
    if(localStorage.getItem('adStatus') === 'changed'){
      this.musicPlayerPageService.playAd(this.flagSongs,this.flagIndex);
      this.resetTime();
      localStorage.setItem('adStatus','inactive');
    }
    else{
      this.count++;
      localStorage.setItem('count', this.count.toString());
      this.checkAdConition();
    }

  }

  checkAdConition(){
    this.time = parseInt(localStorage.getItem('timer'));
    this.count = parseInt(localStorage.getItem('count'))
    console.log(Math.floor((Date.now() - this.time )/1000))
    if( Math.floor((Date.now() - this.time )/1000) > 720 && this.count >= 4){
      localStorage.setItem('adStatus','active');
    }
    else{

    }
  }

  resetTime(){
    this.count = 0;
    this.time = Date.now();
    localStorage.setItem('count', this.count.toString());
    localStorage.setItem('timer', Date.now().toString());
  }

  updateAds(data){
    let id = data.did;
    delete data['did'];
    data.view++;
    this.api.updateAdsSong(id,data)
      .then(res =>{
        console.log('Ad Updated')
      }, err =>{
        console.log('error while updating');
      })
  }

  doNotheing(){
    return;
  }
}
