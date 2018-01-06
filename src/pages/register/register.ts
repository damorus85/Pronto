import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

// Self made pages
import { ScanPage } from '../../pages/scan/scan';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  // Setting form valid to false
  public formValid = false;
  
  // Constructor
  constructor(
    private storage: Storage,
    private alertController : AlertController,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  // Checking if form is valid
  checkValid(values){
    if(
      values.fullname != "" && 
      values.email != "" && 
      values.password != "" && 
      values.repeat != ""
    ){
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  // Registrating the user
  doRegister(values){

    // Valid email regexp pattern
    let regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    
    // Conditions
    if(values.password != values.repeat){

      // Password and repeat is not the same
      let alertController = this.alertController.create({
        title : "Feil p&aring; passord!",
        message : "Passord og gjenta er ikke like",
        buttons: ['OK']
      });
      alertController.present();

    } else if(!regExp.test(values.email)) {

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
        content : "Registrerer deg..."
      });
      loading.present();

      // Sending the post data to the API
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

          // Saving the user id and redirecting
          this.storage.set('pronto-uid', data.data.serviceuserid);
          this.navCtrl.setRoot(ScanPage);
        }
      }, error => {
        console.log(error);// Error getting the data
      })
    }
  }

}
