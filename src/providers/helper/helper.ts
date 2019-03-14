import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { ToastController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

/*
  Generated class for the HelperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HelperProvider {

  constructor(private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController, private loadingCtrl: LoadingController, private http: Http
    ) {

  }

  presentActionSheet(title, n1, n2, myfunc, myfunc1) {
    let actionSheet = this.actionSheetCtrl.create({
      title: title,
      buttons: [
        {
          text: n1,
          role: 'destructive',
          cssClass: 'actions-sheet',
          handler: myfunc
        },
        {
          text: n2,
          role: 'destructive',
          cssClass: 'actions-sheet',
          handler: myfunc1
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'action-sheet-cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  
  loading;

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();

  }

  closeLoading() {
    this.loading.dismiss();
  }

  getCountries() {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: myHeaders });
    return this.http.get('./assets/data/country.json', options)
      .pipe(map((this.extractData)))
  }

  extractData(res) {
    let body = res.json();
    return body;
  }

}
