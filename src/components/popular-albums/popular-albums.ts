import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AlbumPage } from '../../pages/album/album';

import { Album } from '../../data/Album';

import { Shuffler } from '../../data/Helpers/Shuffler';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'popular-albums',
  templateUrl: 'popular-albums.html'
})
export class PopularAlbumsComponent implements OnInit {
  popularAlbums;

  constructor(private navCtrl: NavController, private api: ApiProvider) {
    console.log('Hello PopularAlbumsComponent Component');

    // this.popularAlbums = Shuffler.shuffle(AlbumsInitializer.albums.slice());
  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.api.getAllAlbums()
      .pipe(map(actions => actions.map(a =>{
        const data =a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))

      .subscribe(res =>{
        this.popularAlbums =res;
      })
  }

  goToAlbum(album) {
    this.navCtrl.push(AlbumPage, { album: album });
  }
}
