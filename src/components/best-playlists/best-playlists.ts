import { Component, Input, Inject, forwardRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlaylistPage } from '../../pages/playlist/playlist';

import { Playlist } from '../../data/Playlist';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { PlaylistsInitializer } from '../../data/Initializers/PlaylistsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { SeeAllPage } from '../../pages/see-all/see-all';

@Component({
  selector: 'best-playlists',
  templateUrl: 'best-playlists.html'
})
export class BestPlaylistsComponent {
  @Input() isLibrary;
  songs: Array<any>;
  myPlaylist;
  playlist;
  images: Array<any>=[];

  constructor(private navCtrl: NavController, private api: ApiProvider,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService) {
    console.log('Hello BestPlaylistsComponent Component');

    this.getData();
  }

  goToPlaylist(playlist: Playlist) {
    this.navCtrl.push(PlaylistPage, { playlist: playlist });
  }

  getData(){
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a => {
          const data =a.payload.doc.data();
          const did = a.payload.doc.id;
          return {did, ...data};
      })))
        .subscribe(res =>{
          this.songs = res;
          console.log(this.songs)
          this.api.getPlaylistById(localStorage.getItem('uid'))
              .pipe(map(actions => actions.map(a => {
                const data =a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
            })))
              .subscribe(resp =>{
                this.myPlaylist = resp;
                console.log(resp)
                if(this.myPlaylist.length > 0)
                  this.playlist = this.myPlaylist[0];
                  this.setImages();
              });
        });
  }

  setImages(){
    if(this.playlist)
    this.playlist.playlist.forEach(a => {
      let x = this.songs.filter(data => data.did === a.songs[0])
      this.images.push(x[0].imageURL);
    });
  }

  openSeeAllPage(item,i){
    this.navCtrl.push(SeeAllPage, {
      data: item,
      type: 'playlist'
    });
  }
}
