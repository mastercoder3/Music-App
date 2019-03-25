import { Component } from '@angular/core';

/**
 * Generated class for the OfflineSongsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'offline-songs',
  templateUrl: 'offline-songs.html'
})
export class OfflineSongsComponent {

  text: string;

  constructor() {
    console.log('Hello OfflineSongsComponent Component');
    this.text = 'Hello World';
  }

}
