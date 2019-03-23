import { Component, Inject, forwardRef, OnInit } from '@angular/core';

import { VideoService } from '../../services/VideoService';
import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';

import { Video } from '../../data/Video';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { VideosInitializer } from '../../data/Initializers/VideosInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { NavController } from 'ionic-angular';
import { SeeAllPage } from '../../pages/see-all/see-all';

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
    private api: ApiProvider,
     private nav: NavController
  ) {
    console.log('Hello PopularVideosComponent Component');
    this.popularVideos = Shuffler.shuffle(VideosInitializer.videos.slice());
  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.api.getpopularVideos1()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.videos =res;
        })
  }

  seeall(){
    this.nav.push(SeeAllPage,{
      data: '',
      type: 'videos'
    })
  }
}
