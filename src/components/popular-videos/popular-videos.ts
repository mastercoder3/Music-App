import { Component, Inject, forwardRef } from '@angular/core';

import { VideoService } from '../../services/VideoService';
import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';

import { Video } from '../../data/Video';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { VideosInitializer } from '../../data/Initializers/VideosInitializer';

@Component({
  selector: 'popular-videos',
  templateUrl: 'popular-videos.html'
})
export class PopularVideosComponent {
  popularVideos: Video[] = [];

  constructor(
    public videoService: VideoService,
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService
  ) {
    console.log('Hello PopularVideosComponent Component');
    this.popularVideos = Shuffler.shuffle(VideosInitializer.videos.slice());
  }
}
