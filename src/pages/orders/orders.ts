import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

// Self made pages
import { OrderDetailsPage } from '../order-details/order-details';
/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  // Public values
  public orders = [];
  public orderStatuses = [];

  // Start up custructor
  constructor(
    private storage: Storage,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      
      // Setting the statuses
      this.orderStatuses[0] = 'Lagt inn';
      this.orderStatuses[1] = 'Behandlet';
      this.orderStatuses[2] = 'Servert';
      this.orderStatuses[3] = 'Betalt';
  }

  // Loading the orders
  public loadOrders(){
    
    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetcing the logged in user
    return this.storage.get('pronto-user').then((user) => {

      // Fetching the selected customer
      return this.storage.get('pronto-sc').then((sc) => {

        // Fetching the users orders
        return this.apiProvider.get('/order/getuserdayorders', {
          id : user['serviceuserid'],
          customerid : sc['customerid']
        }).subscribe((data) => {
          loading.dismiss();
          let orders = data.data

          // Formatting the time since
          let now = new Date();
          for(var key in orders){

            // Finding the different hours, mins and secs
            let date = new Date(orders[key].date_created);
            let difference = (now.getTime() - date.getTime()) / 1000;
            let hours = Math.floor(difference / 3600);
            let remaining = difference % 3600;
            let min = Math.floor(remaining / 60);
            let sec = Math.floor(remaining % 60);
            
            // Printing the label
            if(hours > 0){
              orders[key].difference = (hours == 1) ? '1 time siden' : hours + ' timer siden';
            } else if(min > 20){
              orders[key].difference = 'Under en time siden';
            } else if(min > 0){
              orders[key].difference = 'Noen minutter siden';
            } else if(sec > 20) {
              orders[key].difference = 'Under ett minutt siden';
            } else {
              orders[key].difference = 'Noen sekunder siden';
            }
          }

          // Setting the orders
          this.orders = orders;
        });
      });
    });
  }

  // Page load
  ionViewDidLoad() {
    this.loadOrders();
  }

  // Refreshing the order list
  refreshOrders(refresher){
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
