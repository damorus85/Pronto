import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

// Self made pages
import { OrderDetailsPage } from '../order-details/order-details';

/**
 * Generated class for the OrderHistoryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-history-list',
  templateUrl: 'order-history-list.html',
})
export class OrderHistoryListPage {

  // Public values
  public customerid;
  public date;
  public company;
  public orders = [];
  public orderStatuses = [];

  // Constructor
  constructor(
    private storage: Storage,
    private loadingController: LoadingController,
    private apiProvider: ApiProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Loading the url params
      this.customerid = this.navParams.get("customerid");
      this.date = this.navParams.get("date");
      this.company = this.navParams.get("company");

      // Setting the statuses
      this.orderStatuses[0] = 'Lagt inn';
      this.orderStatuses[1] = 'Behandlet';
      this.orderStatuses[2] = 'Servert';
      this.orderStatuses[3] = 'Betalt';
  }

  // Page load
  ionViewDidLoad() {
    this.loadOrders();
  }

  // Loading the orders
  public loadOrders(){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching the user
    return this.storage.get('pronto-user').then((user) => {

      // Fetching the order history
      return this.apiProvider.get("/orderhistory/getcustomerdayorders", {
        serviceuserid : user.serviceuserid,
        customerid : this.customerid,
        date : this.date
      }).subscribe((data) => {
        this.orders = data.data;
        loading.dismiss();
      });
    });
  }

  // Refresh the order list
  refreshOrderList(refresher){
    this.loadOrders().then(() => {
      refresher.complete();
    });
  }

  // Goto details
  gotoOrderDetails(orderid){
    this.navCtrl.push(OrderDetailsPage, {
      orderid : orderid
    });
  }
}
