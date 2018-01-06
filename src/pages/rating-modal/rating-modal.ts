import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

// Self made pages
import { ScanPage } from '../../pages/scan/scan';

/**
 * Generated class for the RatingModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-rating-modal',
  templateUrl: 'rating-modal.html',
})
export class RatingModalPage {

  // Values
  public customer = {};
  public user = {};
  public serviceRating = 0;
  public foodRating = 0;
  public comment = "";


  // Constructor
  constructor(
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    private alertController : AlertController,
    private storage: Storage,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Getting the selected customer and user
      this.storage.get('pronto-sc').then((sc) => this.customer = sc);
      this.storage.get('pronto-user').then((user) => this.user = user);
  }

  // Setting the service rating
  setServiceRating(rating){
    this.serviceRating = rating;
  }

  // Setting the food rating
  setFoodRating(rating){
    this.foodRating = rating;
  }

  // Setting the comment
  setComment(comment){
    this.comment = comment;
  }

  // Saving the rating
  saveRating(){

    // Checking empty ratings
    if(this.serviceRating == 0 || this.foodRating == 0){
      
      // Warning message
      let alert = this.alertController.create({
        title: 'Gi karakter',
        message: 'Husk å gå både servicen og maten en karakter',
        buttons: ['OK']
      });
      alert.present();

    } else {

      // Starting the loading
      let loading = this.loadingController.create({
        content : "Laster vennligst vent..."
      });
      loading.present();
    
      // Saving the rating
      this.apiProvider.post('/rating', {
        customerid : this.customer['customerid'],
        serviceuserid : this.user['serviceuserid'],
        servicerating : this.serviceRating,
        foodrating : this.foodRating,
        feedback : this.comment,
      }).subscribe((data) => {
        loading.dismiss();

        // Checking the status
        if(data.status == true){
          
          // Showing the alert
          let alert = this.alertController.create({
            title: 'Tusen takk!',
            message: 'Tusen takk for din tilbakemelding! Det betyr veldig mye! Din tilbakemelding bidrar til at opplevelsen hos oss blir bedre',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.setRoot(ScanPage);
                }
              }
            ]
          });
          alert.present();
        } else {
          // Showing the alert
          let alert = this.alertController.create({
            title: 'Oops!',
            message: 'Det oppstod en feil ved lagring av din tilbakemelding. Vennligst kontakt betjeningen',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.setRoot(ScanPage);
                }
              }
            ]
          });
          alert.present();
        }
      });

      // Clearing table number and customer
      this.storage.remove('pronto-tid');
      this.storage.remove('pronto-sc');
      this.storage.remove('pronto-sc-date');
      this.storage.remove('pronto-cart');
      this.storage.remove('pronto-cart-comment');
    }
  }

  // Canceling the page
  cancelRating(){
    
    // Checking not empty ratings
    if(this.serviceRating > 0 || this.foodRating > 0 || this.comment != ""){
      
      // Warning message
      let alert = this.alertController.create({
        title: 'Vil du avslutte?',
        message: 'Vil du avslutte uten å gi tilbakemeldingen du har satt?',
        buttons: [
          {
            text: 'Avbryt',
            role: 'cancel'
          },
          {
            text: 'Avslutt besøk',
            handler: () => {
              this.navCtrl.setRoot(ScanPage);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.setRoot(ScanPage);
    }
  }
}