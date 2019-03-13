import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { VideoService } from '../../services/VideoService';
import { AudioService } from '../../services/AudioService';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { Randomizer } from '../../data/Helpers/Randomizer';

@IonicPage()
@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {
  followersCount = Randomizer.randomIntFromInterval(100, 999);
  followingCount = Randomizer.randomIntFromInterval(100, 999);

  constructor(
    private videoService: VideoService,
    private audioService: AudioService,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LibraryPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter LibraryPage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    if (this.audioService.playingTrack()) {
      this.musicPlayerPageService.showFooterPlayer();
    }
  }
}
