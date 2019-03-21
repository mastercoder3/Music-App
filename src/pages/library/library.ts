import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';

import { VideoService } from '../../services/VideoService';
import { AudioService } from '../../services/AudioService';
import { MusicPlayerPageService } from '../../services/MusicPlayerPageService';

import { Randomizer } from '../../data/Helpers/Randomizer';
import { ApiProvider } from '../../providers/api/api';

import { Camera, CameraOptions  } from '@ionic-native/camera';
import { HelperProvider } from '../../providers/helper/helper';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { LoginPage } from '../login/login';
import { SongUploadPage } from '../song-upload/song-upload';

@IonicPage()
@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {
  followersCount = Randomizer.randomIntFromInterval(100, 999);
  followingCount = Randomizer.randomIntFromInterval(100, 999);
  user;
  sourcex;
  base64Image;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  type;

  constructor(
    private videoService: VideoService,
    private audioService: AudioService,
    private navCtrl: NavController,
    private modal: ModalController,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService,
    private api: ApiProvider, private camera: Camera, private helper: HelperProvider,  private fireStorage: AngularFireStorage,
  ) {}

  ionViewDidLoad() {
    this.getData();
    this.type = localStorage.getItem('type');
  }

  getData(){
    this.api.getUserById(localStorage.getItem('uid'))
      .subscribe(res =>{
        this.user = res;
        console.log(res);
      })
  }

  logout(){
    localStorage.removeItem('uid');
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter LibraryPage');

    if (this.videoService.currentVideo) {
      this.videoService.showMiniPlayer();
    }

    if (this.audioService.playingTrack()) {
      this.musicPlayerPageService.showFooterPlayer();
    }
  }

  choosePicture(){
    let myfunc = () => {
      this.takePhoto('library');
    };
    let myfunc1 = () => {
      this.takePhoto('camera');
    };
    this.helper.presentActionSheet('Choose an option.','Gallery','Camera',myfunc,myfunc1);
  }

  takePhoto(source){
    if(source === 'camera'){
      this.sourcex =this.camera.PictureSourceType.CAMERA;
      
    }else if(source === 'library'){
      this.sourcex =this.camera.PictureSourceType.PHOTOLIBRARY;

    }
    
      const options: CameraOptions = {
        sourceType: this.sourcex,
        quality: 30,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
 
      }, (err) => {
      // Handle error
      console.log(err);
      });
  }

  upload() {

    this.ref = this.fireStorage.ref(`users/${this.user.imageId}`);
    let task = this.ref.putString(this.base64Image, 'data_url');
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.user.imageURL = url;
          if (this.user.imageURL !== '') {
            this.updateUser();
          }
        });
      })).subscribe();
  }

  updateUser(){
    this.api.updateUser(localStorage.getItem('uid'),this.user)
      .then(res=>{
        
      }, err =>{
        this.helper.presentToast(err.message);
      })
  }

  uploadSong(){
   const modal =  this.modal.create(SongUploadPage);
   modal.present();
  }



}
