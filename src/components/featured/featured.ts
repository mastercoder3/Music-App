import { Component, Inject, forwardRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';

import { AlbumPage } from '../../pages/album/album';

import { Song } from '../../data/Song';
import { Album } from '../../data/Album';
import { Video } from '../../data/Video';

import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';
import { VideosInitializer } from '../../data/Initializers/VideosInitializer';
import { ApiProvider } from '../../providers/api/api';

import { map } from 'rxjs/operators';

@Component({
  selector: 'featured',
  templateUrl: 'featured.html'
})
export class FeaturedComponent implements OnInit{
  // featuredSongs: Song[] = [];
  // featuredAlbum: Album;
  // featuredVideo: Video;
  songs;

  constructor(
    private navCtrl: NavController,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService,
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService,
    private api: ApiProvider
  ) {
    console.log('Hello FeaturedComponent Component');

    // this.featuredSongs = SongsInitializer.songs.slice().splice(0, 5);
    // this.featuredAlbum = AlbumsInitializer.albums.slice()[0];
    // this.featuredVideo = VideosInitializer.videos.slice()[0];
  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.api.getFeaturedSongs()
      .pipe(map(action => action.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res =>{
        this.songs = res;
      })
  }

  goToAlbum(album: Album) {
    this.navCtrl.push(AlbumPage, { album: album });
  }

}
