import { Component, Inject, forwardRef, OnInit } from '@angular/core';
import {
  IonicPage,
  NavParams,
  NavController,
  ModalController
} from 'ionic-angular';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { ModalService } from '../../services/ModalService';
import { VideoService } from '../../services/VideoService';
import { AudioService } from '../../services/AudioService';
import { ApiProvider } from '../../providers/api/api';
import{ map } from 'rxjs/operators';


@IonicPage()
@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'
})
export class ArtistPage implements OnInit {
  artist;
  type;

  popularSongs = [];
  artistAlbums = [];
  singles= [];
  songs;
  myPlaylist;
  playlist;
  liked;
  followers;
  isFollowing = false;
  userFollowers;
  followings;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    public modalService: ModalService,
    private videoService: VideoService,
    private audioService: AudioService,
    private api: ApiProvider,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService
  ) {
    this.type = localStorage.getItem('type');
    this.artist = this.navParams.get('data');
    console.log(this.artist);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtistPage');

  }

  ngOnInit(){
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a => {
          const data =a.payload.doc.data();
          const did = a.payload.doc.id;
          return {did, ...data};
      })))
        .subscribe(res =>{
          this.songs = res;
          console.log(this.songs)
          this.api.getPlaylistById(this.artist.did)
              .pipe(map(actions => actions.map(a => {
                const data =a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
            })))
              .subscribe(resp =>{
                this.myPlaylist = resp;
                console.log(this.myPlaylist);
                this.setPlaylist();
              });
              this.api.getLikedSongs(this.artist.did)
              .pipe(map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const did = a.payload.doc.id;
                return {did, ...data};
              })))
        
              .subscribe(resp =>{
                this.liked = resp;
                console.log(resp);
                this.getPlayingSongs();
              });
        });
    
    this.api.getFollowers(this.artist.did)
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

      .subscribe(resp =>{
        this.followers = resp;
        if(this.followers.length > 0)
           this.userFollowers = this.followers[0];
        this.checkFollowers();
        console.log(resp)
      });
    
    this.api.getFollowings(localStorage.getItem('uid'))
    .pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))

    .subscribe(resp =>{
     this.followings = resp;
    });
    
  }

  checkFollowers(){
    if(this.followers.length !==0){
      let x = this.followers[0].users.filter(data => data === localStorage.getItem('uid'));
      if(x.length > 0){
        this.isFollowing = true;
      }
      else{
        this.isFollowing = false;
      }
    }
  }

  

  songPairs;

  getPlayingSongs(){
    if(this.liked.length !== 0){
      this.songPairs = this.songs.filter( data => this.liked[0].songs.indexOf(data.did)> -1);
      console.log(this.songPairs)
    }
  }

  setPlaylist(){
    if(this.myPlaylist.length !==0){
      this.playlist = this.songs.filter( data => this.myPlaylist[0].songs.indexOf(data.did) > -1);
    }
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ArtistPage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    if (this.audioService.playingTrack()) {
      this.musicPlayerPageService.showFooterPlayer();
    }
  }

  followUser(){
    if(this.followers.length === 0){
      let x = [];
      x.push(localStorage.getItem('uid'));
      this.api.addFollowers({
        uid: this.artist.did,
        users: x
      }).then(res =>{
        this.setFollowing();
      }, err => console.log(err));
    }
    else{
      let x = this.userFollowers.users;
      x.push(localStorage.getItem('uid'));
      this.api.updateFollowers(this.userFollowers.did,{
        uid: this.artist.did,
        users: x
      }).then(res =>{
        this.setFollowing();
      }, err => console.log(err));
    }
  }

  setFollowing(){
    if(this.followings.length === 0){
      let x = [];
      x.push(this.artist.did);
      this.api.addFollowing({
        uid: localStorage.getItem('uid'),
        users: x
      });
    }
    else{
      let x = this.followings;
      x.push(this.artist.did);
      this.api.updateFollowing(this.followings.did,{
        uid: localStorage.getItem('uid'),
        users: x
      });
    }
  }

  unfollow(){
    this.userFollowers.users.splice(this.userFollowers.users.indexOf(localStorage.getItem('uid')), 1);
    this.api.updateFollowers(this.userFollowers.did,{
      uid: this.artist.did,
      users: this.userFollowers.users
    }).then (res => {
      this.followings[0].users.splice(this.followings.users.indexOf(this.artist.did), 1);
        this.api.updateFollowing(this.followings.did,{
          uid: localStorage.getItem('uid'),
          users: this.followings.users
        });
    })

  }
}
