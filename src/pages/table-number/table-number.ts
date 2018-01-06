import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

// Self made modals
import { HomeMenuModalPage } from '../home-menu-modal/home-menu-modal';
/**
 * Generated class for the TableNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-table-number',
  templateUrl: 'table-number.html',
})
export class TableNumberPage {
  @ViewChild('input') myInput ;

  // Setting form valid to false
  public formValid = false;
  public customer = [];

  // Constructor
  constructor(
    private modalController: ModalController,
    private storage: Storage,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Getting the selected customer
      this.storage.get('pronto-sc').then((sc) => this.customer = sc);
  }

  // Checking if form is valid
  checkValid(values){
    if(values.customerid != ""){
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  // Opening settings
  openSettings(){
    let modal = this.modalController.create(HomeMenuModalPage);
    modal.present();
  }

  ionViewDidLoad() {
    
        setTimeout(() => {
          this.myInput.setFocus();
        },150);
    
     }

  // Loading the restaurant
  setTable(tablenumber){
   
    // Saving the customer and redirecting to the table selector
    this.storage.set('pronto-tid', tablenumber);
    this.navCtrl.setRoot(HomePage);
  }
}
