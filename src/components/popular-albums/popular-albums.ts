import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AlbumPage } from '../../pages/album/album';

import { Album } from '../../data/Album';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';

@Component({
  selector: 'popular-albums',
  templateUrl: 'popular-albums.html'
})
export class PopularAlbumsComponent {
  popularAlbums: Album[] = [];

  constructor(private navCtrl: NavController) {
    console.log('Hello PopularAlbumsComponent Component');

    this.popularAlbums = Shuffler.shuffle(AlbumsInitializer.albums.slice());
  }

  goToAlbum(album: Album) {
    this.navCtrl.push(AlbumPage, { album: album });
  }
}
