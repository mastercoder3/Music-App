import { Component, Input, Inject, forwardRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlaylistPage } from '../../pages/playlist/playlist';

import { Playlist } from '../../data/Playlist';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { PlaylistsInitializer } from '../../data/Initializers/PlaylistsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

@Component({
  selector: 'best-playlists',
  templateUrl: 'best-playlists.html'
})
export class BestPlaylistsComponent {
  @Input() isLibrary;
  bestPlaylists: Playlist[] = [];
  songs: Array<any>;
  myPlaylist;
  playlist;

  constructor(private navCtrl: NavController, private api: ApiProvider,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService) {
    console.log('Hello BestPlaylistsComponent Component');

    this.bestPlaylists = Shuffler.shuffle(PlaylistsInitializer.playlists);
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
          this.api.getPlaylistById(localStorage.getItem('uid'))
              .pipe(map(actions => actions.map(a => {
                const data =a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
            })))
              .subscribe(resp =>{
                this.myPlaylist = resp;
                this.setPlaylist();
              });
        });
  }

  setPlaylist(){
    if(this.myPlaylist.length !==0){
      this.playlist = this.songs.filter( data => this.myPlaylist[0].songs.indexOf(data.did) > -1);
    }
  }
}
