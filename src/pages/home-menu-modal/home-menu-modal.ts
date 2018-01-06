import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// Self made pages
import { ProfilePage } from '../profile/profile';
import { OrderHistoryPage } from '../../pages/order-history/order-history';
/**
 * Generated class for the HomeMenuModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home-menu-modal',
  templateUrl: 'home-menu-modal.html',
})
export class HomeMenuModalPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  // Closing the modal window
  closeSettings(){
    this.navCtrl.pop();
  }

  // Goto
  gotoPage(page){
    switch (page) {
      case 'profile':
        this.navCtrl.push(ProfilePage);
        break;
      case 'order-history':
        this.navCtrl.push(OrderHistoryPage);
        break;
    }
  }
}
