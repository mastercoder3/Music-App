import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiProvider } from '../../providers/api/api';
import { NavController } from 'ionic-angular';
import { SeeAllPage } from '../../pages/see-all/see-all';

/**
 * Generated class for the PublicPlaylistComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'public-playlist',
  templateUrl: 'public-playlist.html'
})
export class PublicPlaylistComponent implements OnInit {

  text: string;
  playlist;

  constructor(private api: ApiProvider, private navCtrl: NavController) {
    console.log('Hello PublicPlaylistComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit(){
    this.api.getAllPublicPlaylist()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
    .subscribe(res =>{
      this.playlist = res;
      console.log(this.playlist)
    })
  }

  openSeeAllPage(item,i){
    this.navCtrl.push(SeeAllPage,{
      data: item,
      type: 'pulicplaylist'
    })
  }

}
