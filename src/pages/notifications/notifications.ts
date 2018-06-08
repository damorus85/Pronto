import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made pages
import { NotificationsCityPage } from '../../pages/notifications-city/notifications-city';
import { NotificationsCustomersPage } from '../../pages/notifications-customers/notifications-customers';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  // Public values
  public user = {};
  public notifications = false;
  public notifications_city = false;
  public notifications_customers = false;

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
        this.user = user

        if(user.notifications == '1'){
          this.notifications = true;
        }

        if(user.notifications_city == '1'){
          this.notifications_city = true;
        }

        if(user.notifications_customers == '1'){
          this.notifications_customers = true;
        }
      });
  }

  // Goto notifications city list
  gotoNotificationsCity(){
    this.navCtrl.push(NotificationsCityPage);
  }

  // Goto notifications customers list
  gotoNotificationsCustomers(){
    this.navCtrl.push(NotificationsCustomersPage);
  }

  // Toggle notifications
  toggleNotifications(event) {
    this.notifications = event;
    this.updateUserValues('notifications', event);
  }

  // Toggle notifications city
  toggleNotificationsCity(event) {
    this.notifications_city = event;
    this.updateUserValues('notifications_city', event);
  }

  // Toggle notifications customers
  toggleNotificationsCustomers(event) {
    this.notifications_customers = event;
    this.updateUserValues('notifications_customers', event);
  }

  // Updating user values
  public updateUserValues(field, value){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Lagrer, vennligst vent..."
    });
    loading.present();

    // Creating the values
    let values = {};
    values['email'] = this.user['email']; 
    values['serviceuserid'] = this.user['serviceuserid'];
    values[field] = (value) ? 1 : 0;

    // Updating the user
    this.apiProvider.post('/user', values).subscribe((data) => {

      // Closing the loading
      loading.dismiss();

      // Checking the response status
      if(data.status !== true){

        // Email exists, please provide with another
        let alertController = this.alertController.create({
          title : "Feil under oppdatering!",
          message : "Det oppstod en feil under oppdateringen av din bruker. Vennligst prøv igjen senere",
          buttons: ['OK']
        });
        alertController.present();

      } else {

        // Saving the user id and returning
        this.storage.set('pronto-user', data.data);
        this.user = data.data;
      }

    }, error => {
      console.log(error);// Error getting the data
    });
  }
}
