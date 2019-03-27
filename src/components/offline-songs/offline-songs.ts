import { Component, OnInit, OnChanges, forwardRef, Inject } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

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
export class OfflineSongsComponent implements OnInit, OnChanges {

 offline;

  constructor(private nativeStorage: NativeStorage,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService) {

  }

  ngOnChanges(){
    console.log('comingggggggggggg')
  }

  ngOnInit(){
    console.log('coming');
    this.nativeStorage.getItem('offline')
      .then(res =>{
        alert(res);
        this.offline = JSON.parse(res);
      }, err =>{
        alert(JSON.stringify(err))
      })
  }

}
