import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import {  NavController, ModalController } from 'ionic-angular';
import { MusicappServiceProvider } from '../../providers/musicapp-service/musicapp-service';

/**
 * Generated class for the OfflineSongsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'offline-songs',
  templateUrl: 'offline-songs.html'
})
export class OfflineSongsComponent implements OnInit, OnChanges, DoCheck {

 offline;

  constructor(private nativeStorage: NativeStorage, private modal: ModalController, private player: MusicappServiceProvider,
    private nav: NavController) {

  }

  ngOnInit(){
    this.nativeStorage.getItem('offline')
      .then(res =>{
        // alert(res);
        this.offline = JSON.parse(res);
      }, err =>{
        // alert(JSON.stringify(err))
      })
  }

  ngDoCheck(){
    this.nativeStorage.getItem('offline')
    .then(res =>{
      // alert(res);
      this.offline = JSON.parse(res);
    }, err =>{
      // alert(JSON.stringify(err))
    })
  }

  ngOnChanges(){
   
  }

  openOfflineMusicPlayer(data, i){
    this.player.openMusicPlayer(this.offline, i);
  }

  showFooterPlayer() {
    var footerPlayerElements = document.getElementsByClassName(
      'offline-footer-player'
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

}
