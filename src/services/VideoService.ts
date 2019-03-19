import { Injectable } from '@angular/core';

import { Video } from '../data/Video';

import { Shuffler } from '../data/Helpers/Shuffler';
import { VideosInitializer } from '../data/Initializers/VideosInitializer';
import { ApiProvider } from '../providers/api/api';
import { map } from 'rxjs/operators';

@Injectable()
export class VideoService {
  allVideos = [];

  currentVideo;
  currentVideoIndex: number;

  constructor(private api: ApiProvider) {
    this.api.getOnlyVideos()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.allVideos = res;
        })
    console.log('%c video service', 'background-color: black; color: white;')
    // this.allVideos = Shuffler.shuffle(VideosInitializer.videos.slice());
  }

  setCurrentVideo(video) {
    console.log(video);
    this.currentVideoIndex = this.allVideos.findIndex(otherVideo => {
      return otherVideo.title === video.title;
    });

    console.log(this.currentVideoIndex);
    this.currentVideo = this.allVideos[this.currentVideoIndex];
    console.log(this.currentVideo);
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
