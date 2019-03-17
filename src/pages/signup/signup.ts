import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { HelperProvider } from '../../providers/helper/helper';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { AuthProvider } from '../../providers/auth/auth';
import { ApiProvider } from '../../providers/api/api';
import { e } from '@angular/core/src/render3';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  Acc_profile: string = 'user';
  form: FormGroup;
  form1: FormGroup;
  base64Image;
  sourcex;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  image;
  uploadImageId;
  countries;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private camera: Camera, 
    private androidPermissions: AndroidPermissions, private helper: HelperProvider,    private fireStorage: AngularFireStorage,
    private auth: AuthProvider, private api: ApiProvider) {
      // First Form
    this.form = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(6)])],
      mobile: ['', Validators.required],
      gender: ['male', Validators.required]
    });
    //Second Form
    this.form1 = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      city: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(6)])],
      mobile: ['', Validators.required],
      gender: ['male', Validators.required],
      country: ['', Validators.required],
      fb: [''],
      insta: [''],
      youtube: ['']
    });

    //get countries

    this.helper.getCountries()
      .subscribe(res =>{
        this.countries = res;
      })


    //Camera Permissions
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
    ).catch(err=> alert(err))
  }

  ionViewDidLoad() {
 
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

  
  onSegmentChange(event){
    this.form.reset();
    this.form1.reset();
    this.base64Image = '';
  }

  data;

  submit(form){
    if(this.base64Image){
      if(this.Acc_profile === 'user')
        this.data = {
          name: form.value.name,
          email: form.value.email,
          password: form.value.password,
          dob: form.value.dob,
          city: form.value.city,
          mobile: form.value.mobile,
          gender: form.value.gender,
          imageURL: '',
          imageId: ''
        }
      else
        this.data ={
          name: form.value.name,
          email: form.value.email,
          password: form.value.password,
          dob: form.value.dob,
          city: form.value.city,
          mobile: form.value.mobile,
          gender: form.value.gender,
          imageURL: '',
          imageId: '',
          country: form.value.country,
          facebook: form.value.fb,
          instagram: form.value.insta,
          youtube: form.value.youtube,
          professions: [''],
          type: this.Acc_profile
        }


      this.uploadImageId = Math.floor(Date.now() / 1000);
      this.helper.presentLoadingDefault();
      this.upload();
    }
    else{
      this.helper.presentToast('Please choose an image to continue.');
    }
  }

  upload() {

      this.ref = this.fireStorage.ref(`users/${this.uploadImageId}`);
      let task = this.ref.putString(this.base64Image, 'data_url');
      task.snapshotChanges()
        .pipe(finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.image = url;
            if (this.image !== '') {
              this.create();
            }
          });
        })).subscribe();
    }

  create(){
    this.data.imageURL = this.image;
    this.data.imageId = this.uploadImageId;
    this.data.type = this.Acc_profile;
    this.auth.signup(this.data.email, this.data.password)
      .then(res =>{
        this.api.createUser(res.user.uid, this.data)
          .then(resp =>{
            localStorage.setItem('uid',res.user.uid);
            localStorage.setItem('type',this.data.type);
            this.helper.closeLoading();
          }, err =>{
            this.helper.presentToast(err.message);
            this.helper.closeLoading();
          })
      }, errr =>{
        this.helper.presentToast(errr.message);
        this.helper.closeLoading();
      })
  }

  professions=[];

  selectProfession(val){
    if(this.professions.length === 0){
      this.professions.push(val);
    }
    else if(this.professions.indexOf(val)> -1){
      this.professions = this.professions.filter(function(item) {
        return item !== val
      });
    }
    else{
      this.professions.push(val);
    }
  }

  back(){
    this.navCtrl.pop();
  }
   


}
