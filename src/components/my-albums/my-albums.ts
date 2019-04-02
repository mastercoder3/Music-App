import { Component } from '@angular/core';

/**
 * Generated class for the MyAlbumsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-albums',
  templateUrl: 'my-albums.html'
})
export class MyAlbumsComponent {

  text: string;

  constructor() {
    console.log('Hello MyAlbumsComponent Component');
    this.text = 'Hello World';
  }

}
