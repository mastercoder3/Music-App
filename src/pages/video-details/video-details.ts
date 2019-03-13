import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { DomSanitizer } from '@angular/platform-browser';

import { ModalService } from '../../services/ModalService';
import { VideoService } from '../../services/VideoService';

import { Video } from '../../data/Video';

import { Shuffler } from '../../data/Helpers/Shuffler';

@IonicPage()
@Component({
  selector: 'page-video-details',
  templateUrl: 'video-details.html'
})
export class VideoDetailsPage {
  relatedVideos: Video[] = [];
  showHeader: boolean = true;

  constructor(
    private navParams: NavParams,
    public modalService: ModalService,
    public videoService: VideoService,
    private screenOrientation: ScreenOrientation,
    public sanitizer: DomSanitizer
  ) {
    var video = this.navParams.get('video');
    this.videoService.setCurrentVideo(video);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoDetailsPage');

    this.setRelatedVideos();
    this.setHeaderVisibility();
  }

  setHeaderVisibility() {
    // detect orientation changes
    this.screenOrientation.onChange().subscribe(() => {
      if (
        this.screenOrientation.type ===
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      ) {
        this.showHeader = false;
      } else {
        this.showHeader = true;
      }
    });
  }

  changeVideo(video: Video) {
    this.videoService.setCurrentVideo(video);
    this.setRelatedVideos();
  }

  nextVideo() {
    this.videoService.next();
    this.setRelatedVideos();
  }

  previousVideo() {
    this.videoService.previous();
    this.setRelatedVideos();
  }

  setRelatedVideos() {
    var tempVideos = this.videoService.allVideos.slice();
    tempVideos.splice(this.videoService.currentVideoIndex, 1);
    this.relatedVideos = Shuffler.shuffle(tempVideos.slice());
  }
}
