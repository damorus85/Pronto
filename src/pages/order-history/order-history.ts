import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the OrderHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {

  // Public values
  public orderhistory = [];

  // Custructor
  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private apiProvider: ApiProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  // onViewDidLoad
  ionViewDidLoad() {
    this.loadOrderHistory();
  }

  // Load order history
  public loadOrderHistory(){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching the user
    return this.storage.get('pronto-user').then((user) => {
      
      // Fetching the order history
      return this.apiProvider.get("/orderhistory/getcustomerlist", {
        serviceuserid : user.serviceuserid
      }).subscribe((data) => {
        this.orderhistory = data.data;
        console.log(this.orderhistory);
        loading.dismiss();
      });
    });
  }

  // Refresh the order list
  refreshOrderHistory(refresher){
    this.loadOrderHistory().then(() => {
      refresher.complete();
    });
  }
}
