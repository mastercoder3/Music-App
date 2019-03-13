import { Injectable, Inject, forwardRef } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { VideoService } from './VideoService';
import { MusicPlayerPageService } from './MusicPlayerPageService';

import { VideoDetailsPage } from '../pages/video-details/video-details';

import { Video } from '../data/Video';

@Injectable()
export class VideoDetailsPageService {
  constructor(
    private modalCtrl: ModalController,
    private videoService: VideoService,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService
  ) {}

  openVideo(video: Video) {
    this.videoService.hideMiniPlayer();

    this.musicPlayerPageService.hideFooterPlayer();

    const modal = this.modalCtrl.create(VideoDetailsPage, { video: video });

    modal.onDidDismiss(() => {
      this.videoService.showMiniPlayer();
    });

    modal.present();
  }
}
