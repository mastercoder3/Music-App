import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AlbumPage } from '../../pages/album/album';

import { Album } from '../../data/Album';
import { AlbumPair } from '../../data/AlbumPair';
import { SongPair } from '../../data/SongPair';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';

@Component({
  selector: 'library-favorites',
  templateUrl: 'library-favorites.html'
})
export class LibraryFavoritesComponent {
  albumPairs: AlbumPair[] = [];
  songPairs: SongPair[] = [];

  constructor(private navCtrl: NavController) {
    console.log('Hello LibraryFavoritesComponent Component');

    this.initialiseAlbumPairs();
    this.initialiseSongPairs();
  }

  initialiseAlbumPairs() {
    var favoriteAlbums = Shuffler.shuffle(
      AlbumsInitializer.albums.slice()
    ).splice(0, 10);

    for (var i = 0; i < favoriteAlbums.length; i++) {
      var albumPair = new AlbumPair();

      var album1 = favoriteAlbums[i];
      albumPair.album1 = album1;

      i++;
      if (i < favoriteAlbums.length) {
        var album2 = favoriteAlbums[i];
        albumPair.album2 = album2;
      }

      this.albumPairs.push(albumPair);
    }
  }

  initialiseSongPairs() {
    var favoriteSongs = Shuffler.shuffle(SongsInitializer.songs.slice()).splice(
      0,
      10
    );

    for (var i = 0; i < favoriteSongs.length; i++) {
      var songPair = new SongPair();

      var song1 = favoriteSongs[i];
      songPair.song1 = song1;

      i++;
      if (i < favoriteSongs.length) {
        var song2 = favoriteSongs[i];
        songPair.song2 = song2;
      }

      this.songPairs.push(songPair);
    }
  }

  goToAlbum(album: Album) {
    this.navCtrl.push(AlbumPage, { album: album });
  }
}
