import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalService } from '../../services/ModalService';
import { MusicappServiceProvider } from '../../providers/musicapp-service/musicapp-service';

/**
 * Generated class for the MyMusicPlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-music-player',
  templateUrl: 'my-music-player.html',
})
export class MyMusicPlayerPage  implements OnInit{

  // /storage/emulated/0/Android/data/apollo.music/files/1553642347.mp3

  song = {
    album: "",
    artist: [
      {
        value: "Testing song",
        display: "Testing Value"
      }
    ],
    imageId: "",
    imageURL: "https://firebasestorage.googleapis.com/v0/b/musicapp-zeitlab.appspot.com/o/Thumbnails%2F1552044765?alt=media&token=fa7ab886-4ab6-4ccc-971d-3af9e5ac1d8e",
    movie: "Toilet",
    oartist: "Kartik Jain",
    songId: "",
    songURL: "/storage/emulated/0/Android/data/apollo.music/files/1553642347.mp3",
    title: "Dil Laga Liya ha main ny",
    video: "",
    views: 0
  };

  progress: 10;
  text = false;
  playing = false;
  currentProgress;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public modalService: ModalService, private player: MusicappServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyMusicPlayerPage');
  }

  ngOnInit(){
    setTimeout( ()=>{
      this.player.create([this.song],0)
      this.text = true;
      this.playing = true;
      this.getCurrentProgressNumber();

    }, 500 )
   
  }

  pause(){
    this.player.pause();
    this.playing = false;
  }
  
  play(){
    this.player.play();
    this.playing = true;
  }


  getCurrentProgressNumber(){
    let x = setInterval( ()=> {
      this.player.getCurrentProgressNumber().then(res =>{
        this.currentProgress = res;
      })
    }, 1000);

    setTimeout( () => {
      clearInterval(x);
    }, this.player.getDuration())
  }


}
