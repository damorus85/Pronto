import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the NotificationsCityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications-city',
  templateUrl: 'notifications-city.html',
})
export class NotificationsCityPage {

  // Public values
  public user = {};
  public all_cities = [];
  public cities = [];
  public selected_cities = [];

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
      });
  }

  // Loading the view
  ionViewWillEnter() {
    
    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching all the allergies
    this.apiProvider.get('/static/values').subscribe((data) => {
      if(data.status == true){
        
        for(let i in data.data['notification_cities']){
          this.all_cities[data.data['notification_cities'][i]['cityid']] = data.data['notification_cities'][i];

          if(this.user['notificationcities'].indexOf('' + data.data['notification_cities'][i]['cityid'] + '') > -1){
            this.selected_cities.push(data.data['notification_cities'][i]);
          } else {
            this.cities.push(data.data['notification_cities'][i]);
          }
        }
        
        // Dismissing the loading
        loading.dismiss();

      } else {

        // Presenting the error message
        let alert = this.alertController.create({
          title: 'Noe galt skjedde!',
          message: "Det oppstod et problem med å hente ut byene, vennligst prøv igjen senere",
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  // Updating the selected/deselected city
  updateCityNotification(event, cityid){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();
    
    // Updating the arrays
    if(!event.value){
      for(let i in this.selected_cities){
        if(this.selected_cities[i]['cityid'] == cityid){
          let index = parseInt(i);
          this.selected_cities.splice(index, 1);
        }
      }
      this.cities.push(this.all_cities[cityid]);
    } else {
      for(let i in this.cities){
        if(this.cities[i]['cityid'] == cityid){
          let index = parseInt(i);
          this.cities.splice(index, 1);
        }
      }
      this.selected_cities.push(this.all_cities[cityid]);
    }

    // Updating the users settings
    this.apiProvider.post('/user/setnotificationscity', {
      serviceuserid : this.user['serviceuserid'],
      cityid : cityid,
      operation : (event.value) ? 'add' : 'remove'
    }).subscribe((data) => {

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

    });
  }
}
