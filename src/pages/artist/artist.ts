import { Component, Inject, forwardRef } from '@angular/core';
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


@IonicPage()
@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'
})
export class ArtistPage {
  artist;
  type;

  popularSongs = [];
  artistAlbums = [];
  singles= [];

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    public modalService: ModalService,
    private videoService: VideoService,
    private audioService: AudioService,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService
  ) {
    this.type = localStorage.getItem('type');
    this.artist = this.navParams.get('data');
    console.log(this.artist);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtistPage');

    // this.popularSongs = Shuffler.shuffle(SongsInitializer.songs.slice()).splice(
    //   0,
    //   10
    // );
    // this.artistAlbums = Shuffler.shuffle(
    //   AlbumsInitializer.albums.slice()
    // ).splice(0, 5);
    // this.singles = Shuffler.shuffle(SongsInitializer.songs.slice()).splice(
    //   0,
    //   10
    // );
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

  // goToAlbum(album: Album) {
  //   this.navCtrl.push(AlbumPage, { album: album });
  // }

  // buySong(song: Song) {
  //   var purchase = new Purchase(
  //     song.name,
  //     song.pictureUrl,
  //     song.artistName,
  //     song.price
  //   );

  //   const modal = this.modalCtrl.create(PurchasesPage, { purchase: purchase });
  //   modal.present();
  // }
}
