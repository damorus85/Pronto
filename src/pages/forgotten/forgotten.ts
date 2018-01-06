import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

// Self made pages
import { ResetPasswordPage } from '../../pages/reset-password/reset-password';

/**
 * Generated class for the ForgottenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgotten',
  templateUrl: 'forgotten.html',
})
export class ForgottenPage {
  // Setting form valid to false
  public formValid = false;
  
  // Constructor
  constructor(
    private alertController : AlertController,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  // Checking if form is valid
  checkValid(values){
    if(values.email != ""){
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  // Goto reset page
  gotoReset(){
    this.navCtrl.push(ResetPasswordPage);
  }

  // Resetting the password
  doForgotten(values){

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
        content : "Laster..."
      });
      loading.present();

      // Sending the post data to the API
      this.apiProvider.post('/user/forgotten', values).subscribe((data) => {
        loading.dismiss();
        
        // User with entered email not found
        if(data.status !== true){
          let alertController = this.alertController.create({
            title : "Feil under registrering!",
            message : (data.errorCode == 'URSFORGOT-EMAIL-NOTFOUND') ? "Finner ingen bruker med eposten du oppgav. Vennligst pr&oslash;v med en annen epost eller registrer deg" : data.message,
            buttons: ['OK']
          });
          alertController.present();

        } else {

          // Request was OK
          let alertController = this.alertController.create({
            title : "Sjekk eposten din!",
            message : "Vi har sendt deg en epost med en kode du kan bruke for &aring; resette passordet ditt",
            buttons: [{
              text : 'Skriv inn kode',
              handler : () => {
                this.navCtrl.push(ResetPasswordPage);
              }
            }]
          });
          alertController.present();

        }
      }, error => {
        console.log(error);// Error getting the data
      })
    }
  }

}
