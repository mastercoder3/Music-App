import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlaylistPage } from '../../pages/playlist/playlist';

import { Playlist } from '../../data/Playlist';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { PlaylistsInitializer } from '../../data/Initializers/PlaylistsInitializer';

@Component({
  selector: 'best-playlists',
  templateUrl: 'best-playlists.html'
})
export class BestPlaylistsComponent {
  @Input() isLibrary;
  bestPlaylists: Playlist[] = [];

  constructor(private navCtrl: NavController) {
    console.log('Hello BestPlaylistsComponent Component');

    this.bestPlaylists = Shuffler.shuffle(PlaylistsInitializer.playlists);
  }

  goToPlaylist(playlist: Playlist) {
    this.navCtrl.push(PlaylistPage, { playlist: playlist });
  }
}
