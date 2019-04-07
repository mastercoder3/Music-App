import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams,
  Platform
} from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { ApiProvider } from '../../providers/api/api';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';


@IonicPage()
@Component({
  selector: 'page-card-selection',
  templateUrl: 'card-selection.html'
})
export class CardSelectionPage {
  purchase;
  amount: number;
  type;
  public product: any = {
    name: 'Music app',
    appleProductId: '1234',
    googleProductId: 'com.kodealpha.awesong.musicapp'
  };

  constructor(
    private navParams: NavParams,
    public modalService: ModalService,
    private api: ApiProvider,
    private platform: Platform,
    private store: InAppPurchase2
  ) {
    this.purchase = this.navParams.get('purchase');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardSelectionPage');

    if(this.platform.is('ios')){
      this.type = 'App Store'
    }
    else{
      this.type = 'Google Play'
    }

    this.configurePurchasing();


    this.api.getPayment()
      .subscribe(res =>{
        this.purchase = res;
        console.log(res);
        this.amount = this.purchase.amount;
      })

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


  async makepurchase() {
    console.log('coming')
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

}
