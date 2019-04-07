import { Component, Inject, forwardRef } from '@angular/core';
import { IonicPage, NavController, ModalController, App, Platform, CardContent } from 'ionic-angular';

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
import { AuthProvider } from '../../providers/auth/auth';
import firebase  from 'firebase';
import { map } from 'rxjs/operators';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import { PurchasesPage } from '../purchases/purchases';
import { CardCreatorPage } from '../card-creator/card-creator';
import { CardSelectionPage } from '../card-selection/card-selection';

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
  USER: firebase.User;
  followers: Array<any>;
  nFollowers;
  following;
  nfollowing;
  tracks;
  ntracks;
  views;
  public product: any = {
    name: 'Music app',
    appleProductId: '1234',
    googleProductId: 'com.kodealpha.awesong.musicapp'
  };

  constructor(
    private videoService: VideoService,
    private audioService: AudioService,
    private navCtrl: NavController,
    private modal: ModalController,
    private store: InAppPurchase2,
    public platform: Platform,
    @Inject(forwardRef(() => MusicPlayerPageService)) public musicPlayerPageService: MusicPlayerPageService,
    private api: ApiProvider, private camera: Camera, private auth: AuthProvider,
     private helper: HelperProvider,  private fireStorage: AngularFireStorage, private app: App, private audio: AudioService
  ) {
  }

  ionViewDidLoad() {
    this.type = localStorage.getItem('type');
    this.getData();
    this.configurePurchasing();
    
  }

  configurePurchasing() {
    if (!this.platform.is('cordova')) { return; }
    let productId;
    try {
      if (this.platform.is('ios')) {
        productId = this.product.appleProductId;
      } else if (this.platform.is('android')) {
        productId = this.product.googleProductId;
      }

      // Register Product
      // Set Debug High
      this.store.verbosity = this.store.DEBUG;
      // Register the product with the store
      this.store.register({
        id: productId,
        alias: productId,
        type: this.store.NON_RENEWING_SUBSCRIPTION
      });

      this.registerHandlers(productId);

      // this.store.ready().then((status) => {
      //   console.log(JSON.stringify(this.store.get(productId)));
      //   console.log('Store is Ready: ' + JSON.stringify(status));
      //   console.log('Products: ' + JSON.stringify(this.store.products));
      // });

      this.store.ready( status =>{
        console.log(JSON.stringify(this.store.get(productId)));
        console.log('Store is Ready: ' + JSON.stringify(status));
        console.log('Products: ' + JSON.stringify(this.store.products));
      })

      // Errors On The Specific Product
      this.store.when(productId).error( (error) => {
        alert('An Error Occured' + JSON.stringify(error));
      });
      // Refresh Always
      console.log('Refresh Store');
      this.store.refresh();
    } catch (err) {
      console.log('Error On Store Issues' + JSON.stringify(err));
    }
  }

  registerHandlers(productId) {
    // Handlers
    this.store.when(productId).approved( (product: IAPProduct) => {
      // Purchase was approved
      product.finish();
    });

    this.store.when(productId).registered( (product: IAPProduct) => {
      console.log('Registered: ' + JSON.stringify(product));
    });

    this.store.when(productId).updated( (product: IAPProduct) => {
      console.log('Loaded' + JSON.stringify(product));
    });

    this.store.when(productId).cancelled( (product) => {
      alert('Purchase was Cancelled');
    });

    // Overall Store Error
    this.store.error( (err) => {
      alert('Store Error ' + JSON.stringify(err));
    });
  }

  async purchase() {
    /* Only configuring purchase when you want to buy, because when you configure a purchase
    It prompts the user to input their apple id info on config which is annoying */
    if (!this.platform.is('cordova')) { return };

    let productId;

    if (this.platform.is('ios')) {
      productId = this.product.appleProductId;
    } else if (this.platform.is('android')) {
      productId = this.product.googleProductId;
    }

    console.log('Products: ' + JSON.stringify(this.store.products));
    console.log('Ordering From Store: ' + productId);
    try {
      let product = this.store.get(productId);
      console.log('Product Info: ' + JSON.stringify(product));
      let order = await this.store.order(productId);
      alert('Finished Purchase');
    } catch (err) {
      console.log('Error Ordering ' + JSON.stringify(err));
    }
  }

  getData(){
    this.api.getUserById(localStorage.getItem('uid'))
      .subscribe(res =>{
        this.user = res;
        console.log(res);
      })
    
    this.api.getFollowers(localStorage.getItem('uid'))
      .pipe(map(actions => actions.map(a => {
        const data =a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res => {
        this.followers = res;
        if(this.followers.length > 0 )
          this.nFollowers = this.followers[0].users.length;
      })

      if(localStorage.getItem('type')==='user'){
        this.api.getFollowings(localStorage.getItem('uid'))
        .pipe(map(actions => actions.map(a => {
          const data =a.payload.doc.data();
          const did = a.payload.doc.id;
          return {did, ...data};
        })))
        .subscribe(res => {
          this.following = res;
          if(this.following[0].users)
            this.nfollowing = this.following[0].users.length;
        })
      }
      
      if(this.type === 'artist'){
        this.api.getArtistTracks(localStorage.getItem('uid'))
        .subscribe(res => {
          this.tracks = res;
          console.log(res);
          if(this.tracks.length > 0){
            this.ntracks = this.tracks.length;
            this.views = 0;
            this.tracks.forEach(a => {
              this.views = this.views + a.views;
            });
          }
           
        })
      }
  }

  logout(){
    localStorage.removeItem('uid');
    localStorage.clear();
    this.auth.logout();
    this.audio.destroyMusicControls();
    this.app.getRootNav().setRoot(LoginPage);
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

  takePhoto(source, val? : string){
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

      if(val !== ''){
        this.uploadAlbum(val);
      }
 
      }, (err) => {
      // Handle error
      console.log(err);
      });
  }

  uploadAlbum(val) {
    let id = Math.floor(Date.now() / 1000);
    this.ref = this.fireStorage.ref(`Thumbnails/${id}`);
    let task = this.ref.putString(this.base64Image, 'data_url');
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          if(url !== ''){
            this.makeAlbum(url,val);
          }
        });
      })).subscribe();
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
    let func = () => {
      const modal =  this.modal.create(SongUploadPage);
      modal.present();
    };

    let func1 = () => {

      let createfunc = (data) => {
        this.createNewAlbum(data.data);
      }

      const alert = this.helper.showAlertGeneric('Create An Album.','Enter Album name.','Album Name','Create',createfunc);
      alert.present();
    };
    this.helper.presentActionSheet('Choose an Option.','Upload a Song', 'Create an Album',func,func1)

  }

  createNewAlbum(name){

    let myfunc = () => {
      this.takePhoto('library', name);
    };
    let myfunc1 = () => {
      this.takePhoto('camera', name);
    };
    
    this.helper.presentActionSheet('Choose An Image To Continue.', 'Gallery','Camera',myfunc,myfunc1)
  
  }

  makeAlbum(url,val){
    let data = {
      name: val,
      createdBy: localStorage.getItem('uid') ? localStorage.getItem('uid') : '',
      imageURL: url,
      songs: []
    }
    this.api.addAlbum(data)
      .then( res =>{
        alert(res);
        this.helper.presentToast('Album Created');
      }, err =>{
        this.helper.presentToast('Album Creation Failed');
      })
  }

  buy(){
    // alert("CORDOVA_PLUGIN_NOT_INSTALLED.");
    // this.navCtrl.popToRoot()
    this.navCtrl.push(CardSelectionPage);
    // this.purchase();
  }

  resetPassword(){

    let func = (data) => {
        firebase.auth().onAuthStateChanged( user => {
          if (user){
            this.USER = user;
            console.log(user)
          user.updatePassword(data.password)
            .then(res => {
              this.helper.presentToast('Password Updated');
            }, err =>{
              console.log('Error while updating password');
            })
          } else { 
              console.log(user)
          }
        });
      
    }
    let x =    this.helper.showPassword(func);
    x.present();


  }



}
