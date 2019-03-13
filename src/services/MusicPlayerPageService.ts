import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { VideoService } from './VideoService';
import { AudioService } from './AudioService';

import { MusicPlayerPage } from '../pages/music-player/music-player';

import { Song } from '../data/Song';

@Injectable()
export class MusicPlayerPageService {
  allSongs: Song[] = [];
  upNextSongs: Song[] = [];

  constructor(
    private modalCtrl: ModalController,
    private videoService: VideoService,
    private audioService: AudioService
  ) {}

  openMusicPlayer(songs: Song[], trackIndex: number) {
    this.videoService.hideMiniPlayer();
    this.hideFooterPlayer();

    this.allSongs = songs;
    var tracks = this.getTracksFromSongs(songs);

    if (!this.audioService.setTracksAndPlay(tracks, trackIndex)) {
      return;
    }

    this.setUpNextSongs();

    const modal = this.modalCtrl.create(MusicPlayerPage);

    modal.onDidDismiss(() => {
      this.showFooterPlayer();
    });

    modal.present();
  }

  simpleOpenMusicPlayer() {
    this.hideFooterPlayer();

    const modal = this.modalCtrl.create(MusicPlayerPage);

    modal.onDidDismiss(() => {
      this.showFooterPlayer();
    });

    modal.present();
  }

  simplePlaySong(song: Song) {
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
    this.upNextSongs = this.allSongs.slice();
    this.upNextSongs.splice(0, this.audioService.trackIndex + 1);
  }

  getTracksFromSongs(songs: Song[]) {
    var tracks = [];

    songs.forEach(song => {
      var track = {
        src: song.songUrl,
        artist: song.artistName,
        title: song.name,
        art: song.pictureUrl,
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
