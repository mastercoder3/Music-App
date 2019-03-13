import { Component, Inject, forwardRef } from '@angular/core';

import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';

import { Video } from '../../data/Video';

import { VideosInitializer } from '../../data/Initializers/VideosInitializer';

@Component({
  selector: 'videos-slider',
  templateUrl: 'videos-slider.html'
})
export class VideosSliderComponent {
  videos: Video[] = [];

  constructor(
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService
  ) {
    console.log('Hello VideosSliderComponent Component');
    this.videos = VideosInitializer.videos;
  }
}
