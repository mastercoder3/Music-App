import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ArtistPage } from '../../pages/artist/artist';

import { Artist } from '../../data/Artist';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { ArtistsInitializer } from '../../data/Initializers/ArtistsInitializer';

@Component({
  selector: 'favorite-artists',
  templateUrl: 'favorite-artists.html'
})
export class FavoriteArtistsComponent {
  favoriteArtists: Artist[] = [];

  constructor(private navCtrl: NavController) {
    console.log('Hello FavoriteArtistsComponent Component');
    this.favoriteArtists = Shuffler.shuffle(ArtistsInitializer.artists);
  }

  goToArtist(artist: Artist) {
    this.navCtrl.push(ArtistPage, { artist: artist });
  }
}
