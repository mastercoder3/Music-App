import { Component, Inject, forwardRef, OnInit } from '@angular/core';

import { VideoService } from '../../services/VideoService';
import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';

import { Video } from '../../data/Video';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { VideosInitializer } from '../../data/Initializers/VideosInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'popular-videos',
  templateUrl: 'popular-videos.html'
})
export class PopularVideosComponent implements OnInit {
  popularVideos: Video[] = [];
  videos;

  constructor(
    public videoService: VideoService,
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService,
    private api: ApiProvider
  ) {
    console.log('Hello PopularVideosComponent Component');
    this.popularVideos = Shuffler.shuffle(VideosInitializer.videos.slice());
  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.api.getpopularVideos()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.videos =res;
        })
  }
}
