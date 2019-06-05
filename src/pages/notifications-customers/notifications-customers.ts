import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the NotificationsCustomersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications-customers',
  templateUrl: 'notifications-customers.html',
})
export class NotificationsCustomersPage {

  // Public values
  public user = {};
  public customers = [];
  public selected_customers = [];

  // Custructor
  constructor(
    private apiProvider: ApiProvider,
    private storage: Storage,
    private alertController : AlertController,
    private loadingController : LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Getting the logged in user
      this.storage.get('pronto-user').then((user) => {
        this.user = user;
        this.customers = user.uniquecustomers;
        this.selected_customers = user.notificationcustomers;
      });
  }

  // Updating the selected/deselected city
  updateCustomerNotification(event, customerid){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();
    
    // Updating the arrays
    if(!event.value){
      
    } else {
      
    }

    // Updating the users settings
    this.apiProvider.put('/user/setnotificationscustomers/' + this.user['serviceuserid'], {
      customerid : customerid,
      operation : (event.value) ? 'add' : 'remove'
    }).subscribe((data) => {

      // Closing the loading
      loading.dismiss();

      // Checking the response status
      if(data.errorMessage != undefined){

        // Email exists, please provide with another
        let alertController = this.alertController.create({
          title : "Feil under oppdatering!",
          message : "Det oppstod en feil under oppdateringen av din bruker. Vennligst prøv igjen senere",
          buttons: ['OK']
        });
        alertController.present();

      } else {

        // Saving the user id and returning
        this.storage.set('pronto-user', data);
        this.user = data;
      }

    });
  }
}
