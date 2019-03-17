import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { AudioService } from '../../services/AudioService';

import { AlbumPage } from '../album/album';
import { ArtistPage } from '../artist/artist';

import { Album } from '../../data/Album';
import { Artist } from '../../data/Artist';

import { Randomizer } from '../../data/Helpers/Randomizer';
import { AlbumsInitializer } from '../../data/Initializers/AlbumsInitializer';
import { ArtistsInitializer } from '../../data/Initializers/ArtistsInitializer';
import { ApiProvider } from '../../providers/api/api';
import { map } from 'rxjs/operators';
import { HelperProvider } from '../../providers/helper/helper';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {
  randomAlbum: Album;
  randomArtist: Artist;
  playlist: Array<any>;

  constructor(
    private navCtrl: NavController,
    public modalService: ModalService,
    public audioService: AudioService,
    private api: ApiProvider,
    private helper: HelperProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsPage');

    this.api.getPlaylistById(localStorage.getItem('uid'))
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return{did, ...data};
      })))
        .subscribe( res =>{
          this.playlist = res;
        });


    this.randomAlbum =
      AlbumsInitializer.albums[
        Randomizer.randomIntFromInterval(0, AlbumsInitializer.albums.length - 1)
      ];

    this.randomArtist =
      ArtistsInitializer.artists[
        Randomizer.randomIntFromInterval(
          0,
          ArtistsInitializer.artists.length - 1
        )
      ];
  }

  goToAlbum() {
    this.navCtrl.push(AlbumPage, { album: this.randomAlbum });
  }

  goToArtist() {
    this.navCtrl.push(ArtistPage, { artist: this.randomArtist });
  }

  addToPlaylist(){
    if(this.playlist.length === 0){
      let x = {
        uid: localStorage.getItem('uid'),
        songs: []
      }
      x.songs.push(localStorage.getItem('songId'));
      this.api.addToPlaylist(x)
        .then(res =>{
          this.helper.presentToast('Song added to Playlist');
        }, err =>{
          this.helper.presentToast(err.message);
        });
    }
    else{
      let x = [];
      x = this.playlist.filter(data => data.songs.indexOf(localStorage.getItem('songId') ) > -1);
      if(x.length === 0){
        this.playlist[0].songs.push(localStorage.getItem('songId'))
        let id = this.playlist[0].did;
        delete this.playlist[0]['did']
        this.api.updatePlaylist(id, this.playlist[0])
          .then(res =>{
            this.helper.presentToast('Song added to Playlist');
          }, err =>{
            this.helper.presentToast(err.message);
          });
      }
      else
        this.helper.presentToast('Songs Already Added in Playlist.')
      
    }

  }
}
