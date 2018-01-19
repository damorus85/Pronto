import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

// Self made pages
import { LoginPage } from '../../pages/login/login';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
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
    if(
      values.reset_code != "" && 
      values.password != "" && 
      values.repeat != ""
    ){
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  // Registrating the user
  doReset(values){
    
    // Conditions
    if(values.password != values.repeat){

      // Password and repeat is not the same
      let alertController = this.alertController.create({
        title : "Feil p&aring; passord!",
        message : "Passord og gjenta er ikke like",
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
      this.apiProvider.post('/user/reset', values).subscribe((data) => {

        // Closing the loading
        loading.dismiss();
        
        // Checking the response status
        if(data.status !== true){

          // Email exists, please provide with another
          let alertController = this.alertController.create({
            title : "Feil under resetting av passord!",
            message : (data.errorCode == 'URSRESETPASS-USER-NOTFOUND') ? "Koden du oppgav er ugyldig. Vennligst se over at koden du skrev er riktig." : data.message,
            buttons: ['OK']
          });
          alertController.present();

        } else {

          // Promting that everyting is OK
          let alertController = this.alertController.create({
            title : "Passord oppdatert!",
            message : "Passordet er oppdatert og du kan logge inn med ditt nye passord",
            buttons: [{
              text : 'Logg inn',
              handler : ()=>{
                this.navCtrl.setRoot(LoginPage);
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
