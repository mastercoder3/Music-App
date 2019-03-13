import { Component, Inject, forwardRef } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AudioService } from '../../services/AudioService';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

@Component({
  selector: 'player-footer',
  templateUrl: 'player-footer.html'
})
export class PlayerFooterComponent {
  constructor(
    public platform: Platform,
    public audioService: AudioService,
    @Inject(forwardRef(() => MusicPlayerPageService))
    public musicPlayerPageService: MusicPlayerPageService
  ) {
    console.log('Hello PlayerFooterComponent Component');
  }
}
