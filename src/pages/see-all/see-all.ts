import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../services/ModalService';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';
import { VideoDetailsPageService } from '../../services/VideoDetailsPageService';

/**
 * Generated class for the SeeAllPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-see-all',
  templateUrl: 'see-all.html',
})
export class SeeAllPage implements OnInit {
  data;
  type;
  songs;
  listSongs: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalService: ModalService, private api: ApiProvider,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService,
    @Inject(forwardRef(() => VideoDetailsPageService))
    public videoDetailsPageService: VideoDetailsPageService) {
    this.data = this.navParams.get('data');
    this.type = this.navParams.get('type');
  }

  ngOnInit(){
    this.listSongs = null;
    if(this.type === 'playlist'){
      this.setPlaylistSongs();
    }
    else if(this.type === 'recent'){
      this.setRecentSongss();
    }
    else if(this.type === 'most'){
      this.getMostPlayed()
    }
    else if(this.type === 'foryou'){
      this.setForYou();
    }
    else if(this.type === 'videos'){
      this.setVideos();
    }
    else if(this.type === 'videos1'){
      this.setNewVideos();
    }
    else if(this.type === 'originals'){
      this.setOriginals();
    }
    else if (this.type === 'pulicplaylist'){
      this.getPublicPlaylist();
    }
  }

  getPublicPlaylist(){
    this.api.getAllSongs()
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
        this.songs = res;
        this.listSongs = this.songs.filter(data => this.data.songs.indexOf(data.did) > -1);
      })
  }

  setNewVideos(){
    this.api.getNewVideos()
    .pipe(map(actions => actions.map(a =>{
      const data =a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
        this.videos = res;
      })
  }



  setPlaylistSongs(){
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.songs = res;
          this.listSongs = this.songs.filter(data => this.data.songs.indexOf(data.did) > -1);
        })
  }

  recentlySongs;

  setRecentSongss(){
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
      this.listSongs = this.songs.filter( data => this.recentlySongs[0].songs.indexOf(data.did)> -1);
      
    }
  }

  getMostPlayed(){
    this.api.getMostPlayedSongs1()
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
        this.listSongs = res;
      });
  }

  setOriginals(){
    this.api.getAllOriginals()
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
        this.listSongs = res;
      });
  }

  setForYou(){
    this.api.getNewSongs1()
    .pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
        this.listSongs = res;

      });
  }

  videos;

  setVideos(){
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SeeAllPage');
  }

  close(){
    this.modalService.dismiss();
  }

}
