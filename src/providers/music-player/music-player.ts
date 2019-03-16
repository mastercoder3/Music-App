import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';

/*
  Generated class for the MusicPlayerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MusicPlayerProvider {

  songs = [];
  index;

  constructor(public audio: NativeAudio) {
  }

  playSong(songs, index){
    console.log(songs[index]);
    this.audio.preloadComplex(songs[index].title, songs[index].songURL,1 ,1, 0);
    this.audio.play(songs[index].title);
  }




}
