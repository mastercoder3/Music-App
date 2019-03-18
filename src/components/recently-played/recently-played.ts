import { Component, Inject, forwardRef } from '@angular/core';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { Song } from '../../data/Song';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'recently-played',
  templateUrl: 'recently-played.html'
})
export class RecentlyPlayedComponent {
  recentlyPlayedSongs: Song[] = [];
  recentlySongs;
  songs;
  recent;

  constructor(@Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService,
  private api: ApiProvider) {
    console.log('Hello RecentlyPlayedComponent Component');

    this.recentlyPlayedSongs = Shuffler.shuffle(
      SongsInitializer.songs.slice()
    ).slice(0, 6);

   this.getData();
  }

  getData(){
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.songs = res;
          this.api.getRecentlyPlayed(localStorage.getItem('uid'))
          .pipe(map(actions => actions.map(a =>{
            const data = a.payload.doc.data();
            const did = a.payload.doc.id;
            return {did, ...data};
          })))
            .subscribe(res =>{
              this.recentlySongs = res;
               this.setRecentSongs();
            })
        })
  }

  setRecentSongs(){
    if(this.recentlySongs.length !== 0){
      this.recent = this.songs.filter( data => this.recentlySongs[0].songs.indexOf(data.did)> -1);
    }
  }
}
