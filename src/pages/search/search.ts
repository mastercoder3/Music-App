import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';

import { RecentSearch } from '../../data/RecentSearch';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';
import { ArtistsInitializer } from '../../data/Initializers/ArtistsInitializer';
import { PlaylistsInitializer } from '../../data/Initializers/PlaylistsInitializer';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  recentSearches: RecentSearch[] = [];

  constructor(public modalService: ModalService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

    var songs = Shuffler.shuffle(SongsInitializer.songs.slice()).splice(0, 3);
    songs.forEach(song => {
      this.recentSearches.push(new RecentSearch(song.name));
    });

    var albums = Shuffler.shuffle(AlbumsInitializer.albums.slice()).splice(
      0,
      3
    );
    albums.forEach(album => {
      this.recentSearches.push(new RecentSearch(album.name));
    });

    var artists = Shuffler.shuffle(ArtistsInitializer.artists.slice()).splice(
      0,
      3
    );
    artists.forEach(artist => {
      this.recentSearches.push(new RecentSearch(artist.name));
    });

    var playlists = Shuffler.shuffle(
      PlaylistsInitializer.playlists.slice()
    ).splice(0, 3);
    playlists.forEach(playlist => {
      this.recentSearches.push(new RecentSearch(playlist.name));
    });

    this.recentSearches = this.recentSearches.sort(function(a, b) {
      return a.hoursAgo - b.hoursAgo;
    });
  }

  remove(recentSearch: RecentSearch) {
    var index = this.recentSearches.findIndex(function(otherRecentSearch) {
      return otherRecentSearch.name === recentSearch.name;
    });

    if (index >= 0) {
      this.recentSearches.splice(index, 1);
    }
  }
}
