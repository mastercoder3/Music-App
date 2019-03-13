import { Component, Inject, forwardRef } from '@angular/core';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { Song } from '../../data/Song';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';

@Component({
  selector: 'recently-played',
  templateUrl: 'recently-played.html'
})
export class RecentlyPlayedComponent {
  recentlyPlayedSongs: Song[] = [];

  constructor(@Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService) {
    console.log('Hello RecentlyPlayedComponent Component');

    this.recentlyPlayedSongs = Shuffler.shuffle(
      SongsInitializer.songs.slice()
    ).slice(0, 6);
  }
}
