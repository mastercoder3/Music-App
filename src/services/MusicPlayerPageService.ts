import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { VideoService } from './VideoService';
import { AudioService } from './AudioService';

import { MusicPlayerPage } from '../pages/music-player/music-player';

import { Song } from '../data/Song';
import { ApiProvider } from '../providers/api/api';
import { map } from 'rxjs/operators';
import { HelperProvider } from '../providers/helper/helper';

@Injectable()
export class MusicPlayerPageService {
  allSongs = [];
  upNextSongs = [];
  ads;
  adSong = [];
  constructor(
    private modalCtrl: ModalController,
    private videoService: VideoService,
    private audioService: AudioService,
    private api: ApiProvider,
    private helper: HelperProvider
  ) {

  }


  openMusicPlayer(songs, trackIndex: number) {
    localStorage.setItem('songId',songs[trackIndex].did);
    this.videoService.hideMiniPlayer();
    this.hideFooterPlayer();

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
      this.upNextSongs = this.allSongs.slice();
      this.upNextSongs.splice(0, this.audioService.trackIndex + 1);

  }

  getAllSongs(){
    return this.allSongs;
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
}
