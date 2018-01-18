import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

// Self made providers
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {

  // Public values
  public orderid;
  public order = {};
  public orderStatuses = [];

  // Start up constructor
  constructor(
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Setting the order id
      this.orderid = this.navParams.get('orderid');

      // Setting the statuses
      this.orderStatuses[0] = 'Lagt inn';
      this.orderStatuses[1] = 'Behandlet';
      this.orderStatuses[2] = 'Levert';
  }

  // Loading the order
  public loadOrder(refresher = null){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching the order
    return this.apiProvider.get('/order/get', {
      id : this.orderid
    }).subscribe((data) => {
      loading.dismiss();
      
      this.order = data.data;
      if(refresher != null){
        if(typeof refresher.complete == 'function'){
          refresher.complete();
        }
      }
    });
  }

  // Page load
  ionViewDidLoad() {
    this.loadOrder();
  }

  // Refreshing the order list
  refreshOrder(refresher){
    this.loadOrder(refresher);
  }
}
