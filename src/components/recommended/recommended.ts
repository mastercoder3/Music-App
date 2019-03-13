import { Component, Inject, forwardRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { PlaylistPage } from '../../pages/playlist/playlist';

import { Song } from '../../data/Song';
import { Playlist } from '../../data/Playlist';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';
import { PlaylistsInitializer } from '../../data/Initializers/PlaylistsInitializer';

@Component({
  selector: 'recommended',
  templateUrl: 'recommended.html'
})
export class RecommendedComponent {
  recommendedSongs: Song[] = [];
  recommendedPlaylists: Playlist[] = [];

  constructor(
    private navCtrl: NavController,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService
  ) {
    console.log('Hello RecommendedComponent Component');

    this.recommendedSongs = Shuffler.shuffle(SongsInitializer.songs.slice());
    this.recommendedPlaylists = Shuffler.shuffle(
      PlaylistsInitializer.playlists.slice()
    );
  }

  goToPlaylist(playlist: Playlist) {
    this.navCtrl.push(PlaylistPage, { playlist: playlist });
  }
}
