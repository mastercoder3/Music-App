import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { VideoService } from './VideoService';
import { AudioService } from './AudioService';

import { MusicPlayerPage } from '../pages/music-player/music-player';

import { Song } from '../data/Song';
import { ApiProvider } from '../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicappServiceProvider } from '../providers/musicapp-service/musicapp-service';
import { HelperProvider } from '../providers/helper/helper';

@Injectable()
export class MusicPlayerPageService {
  allSongs = [];
  upNextSongs = [];
  ads;
  adSong = [];
  recent:Array<any> = [];
  constructor(
    private modalCtrl: ModalController,
    private videoService: VideoService,
    private audioService: AudioService,
    private api: ApiProvider, private player: MusicappServiceProvider
  ) {
    this.api.getRecentlyPlayed(localStorage.getItem('uid'))
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
        this.recent = res;
        console.log(this.recent);
      });
  }

  getCurrentSongDetails(){
    return this.allSongs[this.audioService.trackIndex];
  }


  openMusicPlayer(songs, trackIndex: number) {
    localStorage.setItem('songId',songs[trackIndex].did);
    if(localStorage.getItem('adStatus') !== 'active'){
        this.videoService.hideMiniPlayer();
    this.hideFooterPlayer();
    this.hideFooterPlayerSecond();
    this.stopOfflinePlayer();
    this.allSongs = songs;
    var tracks = this.getTracksFromSongs(songs);

    if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) {
      return;
    }

    this.setUpNextSongs();

    const modal = this.modalCtrl.create(MusicPlayerPage, {songs: songs, index: trackIndex});

    modal.onDidDismiss(() => {
      this.showFooterPlayer();
    });

    modal.present();


    }
  
  }

  setRecentlyPlayed(){
    if(this.recent.length === 0){
      let x = {
        uid: localStorage.getItem('uid'),
        songs: []
      }
      x.songs.push(localStorage.getItem('songId'));
      this.api.addRecentPlayed(x)
        .then( res =>{
          console.log('recently added');
        }, err =>{
          console.log(err.message);
        })
    }
    else{
      const songId = localStorage.getItem('songId');
     
        if(this.recent[0].songs.indexOf(songId) > -1){
          let index = this.recent[0].songs.indexOf(songId);
          this.recent[0].songs.splice(index,1);
        
          if(this.recent[0].songs.length !== 10){
            this.recent[0].songs.unshift(songId);
            let data = {
              uid: localStorage.getItem('uid'),
              songs: this.recent[0].songs
            }
            this.api.updateRecentlyPlayed(this.recent[0].did,data)
            .then( res =>{
              console.log('recently added');
            }, err =>{
              console.log(err.message);
            })
          }
            
          
        }
        else{
          if(this.recent[0].songs.length !== 10){
            let x = this.recent[0].songs;
            x.push(songId);
            let data ={
              uid: localStorage.getItem('uid'),
              songs: x
            }
            this.api.updateRecentlyPlayed(this.recent[0].did,data)
            .then( res =>{
              console.log('recently added');
            }, err =>{
              console.log(err.message);
            })
          }
        }      
    }
  }

  playAd(songs, trackIndex){
    this.allSongs = songs;
    var tracks = this.getTracksFromSongs(songs);

    if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) {
      return;
    }

    this.setUpNextSongs();
  }

  simpleOpenMusicPlayer() {
    this.hideFooterPlayer();
    this.hideFooterPlayerSecond();
    const modal = this.modalCtrl.create(MusicPlayerPage);

    modal.onDidDismiss(() => {
      this.showFooterPlayer();
    });

    modal.present();
  }

  simplePlaySong(song) {
    var tracks = this.getTracksFromSongs(this.allSongs);

    var trackIndex = this.allSongs.findIndex(function(otherSong) {
      return otherSong.name === song.name;
    });

    if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) {
      return;
    }

    this.setUpNextSongs();
  }

  setUpNextSongs() {
    localStorage.setItem('songId', this.allSongs[this.audioService.trackIndex].did);
    this.updateSong();
    this.setRecentlyPlayed();
      this.upNextSongs = this.allSongs.slice();
      this.upNextSongs.splice(0, this.audioService.trackIndex + 1);

  }

  getAllSongs(){
    return this.allSongs;
  }

  updateSong(){
    this.allSongs[this.audioService.trackIndex].views++
    this.api.updateSongs(localStorage.getItem('songId'), this.allSongs[this.audioService.trackIndex] )
    .then(res =>{
      console.log('views Updated');
    }, err =>{
      console.log(err)
    })
  }




  getTracksFromSongs(songs) {
    var tracks = [];
    
    songs.forEach(song => {
      var track = {
        src: song.songURL,
        artist: song.oartist,
        title: song.title,
        art: song.imageURL,
        preload: 'metadata', // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
        isLiked: song.isLiked
      };

      tracks.push(track);
    });

    return tracks;
  } 

  showFooterPlayer() {
    var footerPlayerElements = document.getElementsByClassName(
      'unique-footer-player'
    );

    for (var i = 0; i < footerPlayerElements.length; i++) {
      var footerPlayer = footerPlayerElements[i];

      if (footerPlayer) {
        footerPlayer.classList.add('alwaysblock');
        footerPlayer.classList.add('mini');
        footerPlayer.classList.add('mini-active');
      }
    }
  }

  hideFooterPlayer() {
    var footerPlayerElements = document.getElementsByClassName(
      'unique-footer-player'
    );

    for (var i = 0; i < footerPlayerElements.length; i++) {
      var footerPlayer = footerPlayerElements[i];

      if (footerPlayer) {
        footerPlayer.classList.remove('alwaysblock');
        footerPlayer.classList.remove('mini');
        footerPlayer.classList.remove('mini-active');
      }
    }
  }

  hideFooterPlayerSecond() {
    var footerPlayerElements = document.getElementsByClassName(
      'offline-footer-player'
    );

    for (var i = 0; i < footerPlayerElements.length; i++) {
      var footerPlayer = footerPlayerElements[i];

      if (footerPlayer) {
        footerPlayer.classList.remove('alwaysblock');
        footerPlayer.classList.remove('mini');
        footerPlayer.classList.remove('mini-active');
      }
    }
  }

  stopOfflinePlayer(){
    if(this.player.getMedia()){
      this.player.destroy();
    }
  }
}
