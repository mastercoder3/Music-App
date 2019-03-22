import { Component, Inject, forwardRef } from '@angular/core';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { Song } from '../../data/Song';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { NavController } from 'ionic-angular';
import { SeeAllPage } from '../../pages/see-all/see-all';

@Component({
  selector: 'recently-played',
  templateUrl: 'recently-played.html'
})
export class RecentlyPlayedComponent {
  recentlyPlayedSongs: Song[] = [];
  recentlySongs;
  songs;
  recent;
  isLiked=[];
  likedsongs;
  exist = false;

  constructor(@Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService,
  private api: ApiProvider, private navCtrl: NavController) {
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
          this.api.getRecentlyPlayed2(localStorage.getItem('uid'))
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

  checkCurrentSongLike(){
    if(this.likedsongs.length > 0 ){
       let x: Array<string> = this.likedsongs[0].songs;
      for(let i = 0; i< this.recent.length; i++){
        if(x.indexOf(this.recent[i].did) > -1 ){
          this.isLiked[i] = true;
        }
        else{
          this.isLiked[i] = false;
        }
      }
    this.exist = true;
    }
    else{
      this.exist = false;
    }
   
  }

  setRecentSongs(){
    if(this.recentlySongs.length !== 0){
      this.recent = this.songs.filter( data => this.recentlySongs[0].songs.indexOf(data.did)> -1);
      console.log(this.recent);
      this.api.getLikedSongs(localStorage.getItem('uid'))
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.likedsongs = res;
          for(let i = 0; i< this.recent.length; i++){
            this.isLiked.push(false);
          }
          this.checkCurrentSongLike();
        });
      
    }
  }

  likeSong(val,i){
    if(val === 'like'){
      if(this.exist){
        let x: Array<string> = this.likedsongs[0].songs;
        x.push(this.recent[i].did);
        let data = {
          uid: localStorage.getItem('uid'),
          songs: x
        };
        this.api.updateLikedSongs(this.likedsongs[0].did, data);
      }
      else if(!this.exist){
        let x = [];
        x.push(this.recent[i].did);
        let data = {
          uid: localStorage.getItem('uid'),
          songs: x
        };
        this.api.addLikedsong(data);
      }
    }
    else if(val === 'dislike'){
      let x: Array<string> = this.likedsongs[0].songs;
      x.splice(x.indexOf(this.recent[i].did), 1);
      let data = {
        uid: localStorage.getItem('uid'),
        songs: x
      };
      this.api.updateLikedSongs(this.likedsongs[0].did, data).then(res =>{
        this.isLiked[i] = false;
      }, err =>{
        console.log(err);
      })
    }
  }

  seeall(){
    this.navCtrl.push(SeeAllPage, {
      data: '',
      type: 'recent'
    })
  }


}
