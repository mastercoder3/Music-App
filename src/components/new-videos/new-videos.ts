import { Component, Inject, forwardRef } from '@angular/core';

import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';

import { Video } from '../../data/Video';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { VideosInitializer } from '../../data/Initializers/VideosInitializer';

@Component({
  selector: 'new-videos',
  templateUrl: 'new-videos.html'
})
export class NewVideosComponent {
  newVideos: Video[] = [];

  constructor(
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService
  ) {
    console.log('Hello NewVideosComponent Component');
    this.newVideos = Shuffler.shuffle(VideosInitializer.videos.slice()).splice(
      0,
      4
    );
  }
}
