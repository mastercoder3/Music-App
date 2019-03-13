import { Injectable } from '@angular/core';

import { Video } from '../data/Video';

import { Shuffler } from '../data/Helpers/Shuffler';
import { VideosInitializer } from '../data/Initializers/VideosInitializer';

@Injectable()
export class VideoService {
  allVideos: Video[] = [];

  currentVideo: Video;
  currentVideoIndex: number;

  constructor() {
    this.allVideos = Shuffler.shuffle(VideosInitializer.videos.slice());
  }

  setCurrentVideo(video: Video) {
    this.currentVideoIndex = this.allVideos.findIndex(otherVideo => {
      return otherVideo.name === video.name;
    });

    this.currentVideo = this.allVideos[this.currentVideoIndex];
  }

  next() {
    this.currentVideoIndex =
      this.currentVideoIndex + 1 >= this.allVideos.length
        ? 0
        : this.currentVideoIndex + 1;
    this.currentVideo = this.allVideos[this.currentVideoIndex];
  }

  previous() {
    this.currentVideoIndex =
      this.currentVideoIndex - 1 < 0
        ? this.allVideos.length - 1
        : this.currentVideoIndex - 1;

    this.currentVideo = this.allVideos[this.currentVideoIndex];
  }

  showMiniPlayer() {
    var miniPlayerElements = document.getElementsByClassName(
      'unique-mini-player'
    );

    for (var i = 0; i < miniPlayerElements.length; i++) {
      var miniPlayer = miniPlayerElements[i];

      if (miniPlayer) {
        miniPlayer.classList.add('alwaysblock');
        miniPlayer.classList.add('mini');
        miniPlayer.classList.add('mini-active');
      }
    }
  }

  hideMiniPlayer() {
    var miniPlayerElements = document.getElementsByClassName(
      'unique-mini-player'
    );

    for (var i = 0; i < miniPlayerElements.length; i++) {
      var miniPlayer = miniPlayerElements[i];

      if (miniPlayer) {
        miniPlayer.classList.remove('alwaysblock');
        miniPlayer.classList.remove('mini');
        miniPlayer.classList.remove('mini-active');
      }
    }

    this.currentVideo = null;
  }
}
