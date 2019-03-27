import { Media, MediaObject } from '@ionic-native/media';
import { Injectable } from '@angular/core';

/*
  Generated class for the MusicappServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MusicappServiceProvider {

  file: MediaObject;
  allsongs;
  trackIndex: number;
  public currentProgress;

  constructor(private media: Media) {
    console.log('Hello MusicappServiceProvider Provider');
  }

  create(song, trackIndex){
    this.allsongs = song;
    this.trackIndex = trackIndex;
    console.log(this.allsongs);
    this.file= this.media.create(this.allsongs[this.trackIndex].songURL);
    this.file.play();
  }

  pause(){
    this.file.pause();
  }
  
  play(){
    this.file.play();
  }

  durationText() {
    var minutes = Math.floor(this.file.getDuration() / 60);
    var seconds = this.file.getDuration() - minutes * 60;

    var duration =
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0));

    return duration;
  }

  getCurrentProgressNumber(){
    return this.file.getCurrentPosition();

  }

  getDuration(){
    return this.file.getDuration();
  }

    progressText(current) {
      if(!current)
      return '00:00';
    var minutes = Math.floor( current / 60);
    var seconds = current- minutes * 60;

    var progress =
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0));

    return progress;
  }

  next(){
    if(this.allsongs.length !== this.trackIndex+1){
      this.trackIndex++;
      this.file.release();
      this.file = this.media.create(this.allsongs[this.trackIndex].songURL);
      this.file.play();
    }
    else{
      this.trackIndex = 0;
      this.file.release();
      this.file = this.media.create(this.allsongs[this.trackIndex].songURL);
      this.file.play();
    }
  }

  previous(){
    if(this.trackIndex - 1 ! === -1){
      this.trackIndex = this.allsongs.length - 1;
      this.file.release();
      this.file = this.media.create(this.allsongs[this.trackIndex].songURL);
      this.file.play();
    }
    else{
      this.trackIndex--;
      this.file.release();
      this.file = this.media.create(this.allsongs[this.trackIndex].songURL);
      this.file.play();
    }
  }

}
