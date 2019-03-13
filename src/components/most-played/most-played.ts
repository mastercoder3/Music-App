import { Component, Inject, forwardRef } from '@angular/core';

import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { Song } from '../../data/Song';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { SongsInitializer } from '../../data/Initializers/SongsInitializer';

@Component({
  selector: 'most-played',
  templateUrl: 'most-played.html'
})
export class MostPlayedComponent {
  mostPlayedSongs: Song[] = [];

  constructor(
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService
  ) {
    console.log('Hello MostPlayedComponent Component');
    this.mostPlayedSongs = Shuffler.shuffle(SongsInitializer.songs.slice());
  }
}
