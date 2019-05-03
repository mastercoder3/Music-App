import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../services/ModalService';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { TabsPage } from '../tabs/tabs';
import { SeeAllPage } from '../see-all/see-all';
import { AudioService } from '../../services/AudioService';

/**
 * Generated class for the MyplaylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myplaylist',
  templateUrl: 'myplaylist.html',
})
export class MyplaylistPage {

  songs: Array<any>;
  myPlaylist;
  playlist;
  images: Array<any>=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalService, private api: ApiProvider, private audio: AudioService) {
  }

  ionViewDidLoad() {
    this.hideFooterPlayer();
    try{
          if(this.audio.progressPercentage())
      this.showFooterPlayer();
    }
    catch(e){
      
    }
    this.getData();
  }

  hideFooterPlayer() {
    var footerPlayerElements = document.getElementsByClassName(
      'unique-footer-player'
    );

    for (var i = 0; i < footerPlayerElements.length; i++) {
      var footerPlayer = footerPlayerElements[i];

      if (footerPlayer) {
        footerPlayer.classList.remove('alwaysblock');
        footerPlayer.classList.remove('mini');
        footerPlayer.classList.remove('mini-active');
      }
    }
  }

  showFooterPlayer() {
    var footerPlayerElements = document.getElementsByClassName(
      'unique-footer-player'
    );

    for (var i = 0; i < footerPlayerElements.length; i++) {
      var footerPlayer = footerPlayerElements[i];

      if (footerPlayer) {
        footerPlayer.classList.add('alwaysblock');
        footerPlayer.classList.add('mini');
        footerPlayer.classList.add('mini-active');
      }
    }
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
                console.log(resp)
                if(this.myPlaylist.length > 0){
                  this.playlist = this.myPlaylist[0];
                  this.setImages();
                }

              });
        });
  }

  setImages(){
    if(this.playlist.playlist.length > 0)
    this.playlist.playlist.forEach(a => {
      let x = this.songs.filter(data => data.did === a.songs[0]);
      if(x.length > 0)
      this.images.push(x[0].imageURL);
    });
  }

  close(){
    // this.navCtrl.setRoot(TabsPage);
    this.navCtrl.pop();
  }

  openSeeAllPage(item,i){
    this.navCtrl.push(SeeAllPage, {
      data: item,
      type: 'playlist',
      did: this.myPlaylist[0],
      index: i
    });
  }

}
