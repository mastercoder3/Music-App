import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ModalController
} from 'ionic-angular';

import { ModalService } from '../../services/ModalService';
import { CardsService } from '../../services/CardsService';

import { CardsManagerPage } from '../cards-manager/cards-manager';

import { Purchase } from '../../data/Purchase';
import { Card } from '../../data/Card';

@IonicPage()
@Component({
  selector: 'page-card-selection',
  templateUrl: 'card-selection.html'
})
export class CardSelectionPage {
  purchase: Purchase;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public modalService: ModalService,
    private cardsService: CardsService
  ) {
    this.purchase = this.navParams.get('purchase');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardSelectionPage');

    var cardElements = document.getElementsByClassName('unique-card');
    this.cardsService.setCardTypes(cardElements);
  }

  selectCard(card: Card) {
    this.cardsService.selectCard(card);
    this.modalService.dismiss();
  }

  manageCards() {
    const modal = this.modalCtrl.create(CardsManagerPage, {
      purchase: this.purchase
    });

    modal.onDidDismiss(() => {
      this.modalService.dismiss();
    });

    modal.present();
  }
}
