import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { AudioService } from '../../services/AudioService';

import { AlbumPage } from '../album/album';
import { ArtistPage } from '../artist/artist';

import { Album } from '../../data/Album';
import { Artist } from '../../data/Artist';

import { Randomizer } from '../../data/Helpers/Randomizer';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';
import { ArtistsInitializer } from '../../data/Initializers/ArtistsInitializer';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {
  randomAlbum: Album;
  randomArtist: Artist;

  constructor(
    private navCtrl: NavController,
    public modalService: ModalService,
    public audioService: AudioService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsPage');

    this.randomAlbum =
      AlbumsInitializer.albums[
        Randomizer.randomIntFromInterval(0, AlbumsInitializer.albums.length - 1)
      ];

    this.randomArtist =
      ArtistsInitializer.artists[
        Randomizer.randomIntFromInterval(
          0,
          ArtistsInitializer.artists.length - 1
        )
      ];
  }

  goToAlbum() {
    this.navCtrl.push(AlbumPage, { album: this.randomAlbum });
  }

  goToArtist() {
    this.navCtrl.push(ArtistPage, { artist: this.randomArtist });
  }
}
