import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

// Self made pages
import { LoginPage } from '../login/login';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  // Public values
  public user = [] ;
  public editMode = false;
  public formValid = true; 

  // Custruvtor
  constructor(
    private apiProvider: ApiProvider,
    private storage: Storage,
    private alertController : AlertController,
    private loadingController : LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Getting the logged in user
      this.storage.get('pronto-user').then((user) => this.user = user);
  }

  // Toggling edit mode
  public toggleEdit(){
    this.editMode = !this.editMode;
  }

  // Checking if form is valid
  public checkValid(values){
    if(
      values.fullname != "" && 
      values.email != ""
    ){
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  // Registrating the user
  doEditProfile(values){

    // Valid email regexp pattern
    let regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    
    // Conditions
    if(!regExp.test(values.email)) {

      // Entered email is not valid
      let alertController = this.alertController.create({
        title : "Feil p&aring; e-post!",
        message : "Du m&aring; oppgi en gyldig epost",
        buttons: ['OK']
      });
      alertController.present();

    } else {

      // Starting the loading
      let loading = this.loadingController.create({
        content : "Uppdaterer deg..."
      });
      loading.present();

      // Sending the post data to the API
      values.serviceuserid = this.user['serviceuserid'];
      this.apiProvider.post('/user', values).subscribe((data) => {

        // Closing the loading
        loading.dismiss();
        
        // Checking the response status
        if(data.status !== true){

          // Email exists, please provide with another
          let alertController = this.alertController.create({
            title : "Feil under registrering!",
            message : (data.errorCode == 'URSREG-EMAIL-EXISTS') ? "E-posten du oppgav finnes fra f&oslash;r. Pr&oslash;v &aring; logg inn eller klikk glemt passord" : data.message,
            buttons: ['OK']
          });
          alertController.present();

        } else {

          // Saving the user id and returning
          this.storage.set('pronto-user', data.data);
          this.user = data.data;
          this.toggleEdit();
        }
      }, error => {
        console.log(error);// Error getting the data
      })
    }
  }

  // Logging out
  logout(){

    // Presenting the confirm
    let confirm = this.alertController.create({
      title: 'Logge ut?',
      message: 'Er du sikker p&aring; at du vil logge ut?',
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Logg ut',
          handler: () => {
            
            // Clearing everything and logging out
            this.storage.remove('pronto-tid');
            this.storage.remove('pronto-sc');
            this.storage.remove('pronto-sc-date');
            this.storage.remove('pronto-cart');
            this.storage.remove('pronto-cart-comment');
            this.storage.remove('pronto-user');
            this.storage.remove('pronto-filters-allergies');

            // Navigating back to login page
            this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    confirm.present();
  }
}
