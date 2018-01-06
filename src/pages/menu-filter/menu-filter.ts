import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the MenuFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-filter',
  templateUrl: 'menu-filter.html',
})
export class MenuFilterPage {

  // Public values
  public allergies = [];
  public selectedAllergies = [];
  public placeHolderAllergies = [];

  // Constructor
  constructor(
    private events: Events,
    private storage: Storage,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    private alertController : AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Getting the selected filters
      this.storage.get('pronto-filters-allergies').then((allergies) => {
        if(allergies != null){
          this.placeHolderAllergies = [];
          for(var key in allergies){
            this.placeHolderAllergies[allergies[key]] = true;
          }
        }
      });
  }

  // Loading the view
  ionViewDidLoad() {
    
    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching all the allergies
    this.apiProvider.get('/static/values').subscribe((data) => {
      if(data.status == true){

        // Setting the allergies
        this.allergies = data.data.allergies;
        loading.dismiss();
      } else {

        // Presenting the error message
        let alert = this.alertController.create({
          title: 'Noe galt skjedde!',
          message: "Det oppstod et problem med å hente ut allergiene, vennligst hør med betjeningen om allergiinformasjonen",
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  // Updating filters
  updateFilters(){

    // Clearing the selected filters
    this.selectedAllergies = [];
    for(var key in this.placeHolderAllergies){
      if(this.placeHolderAllergies[key] == true){
        this.selectedAllergies.push(parseInt(key));
      }
    }
    
    // Saving the selected filters
    this.storage.remove('pronto-filters-allergies').then(() => {
      this.storage.set('pronto-filters-allergies', this.selectedAllergies);
    });
  }

  // Closing the filters
  closeFilters(){
    this.navCtrl.pop().then(() => {
      this.events.publish('filters-set');
    });
  }
}
