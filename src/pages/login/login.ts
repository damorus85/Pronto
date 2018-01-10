import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

// Self made pages
import { RegisterPage } from '../../pages/register/register';
import { ForgottenPage } from '../../pages/forgotten/forgotten';
import { ScanPage } from '../../pages/scan/scan';

import { Storage } from '@ionic/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */ 

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // Setting form valid to false
  public formValid = false;
  public facebookLoading;

  // Constructor
  constructor(
    private facebook: Facebook,
    private storage: Storage,
    private alertController : AlertController,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  // Goto register page
  gotoRegister(){
    this.navCtrl.push(RegisterPage);
  }

  // Goto forgotten password page
  gotoForgotten(){
    this.navCtrl.push(ForgottenPage);
  }

  // Checking if form is valid
  checkValid(values){
    if(values.email != "" && values.password != ""){
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  // Loggin in
  doLogin(values){

    // Starting loading view
    let loading = this.loadingController.create({
      content : "Logger deg inn..."
    });
    loading.present();

    // Fetching login from API
    this.apiProvider.get('/user/login', {
      email : values.email,
      password : values.password
    }).subscribe((data) => {

      // Closing the loading
      loading.dismiss();
      
      // Checking response status
      if(data.status !== true){

        // Invalid login
        let alertController = this.alertController.create({
          title : "Feil under p&aring;logging!",
          message : "Feil brukernavn og/eller passord. Vennligst pr&oslash;v igjen",
          buttons: ['OK']
        });
        alertController.present();
      } else {

        // Saving the user id and redirecting
        this.storage.set('pronto-user', data.data);
        this.navCtrl.setRoot(ScanPage);
      }
    });
  }

  // Facebook login
  doLoginWithFacebook(){

    // Starting loading view
    this.facebookLoading = this.loadingController.create({
      content : "Logger deg inn..."
    });
    this.facebookLoading.present();

    // Logging in with facebook
    this.facebook.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
      if(res.status === "connected") {

        // Fetching the user details via the facebook GRAPH API
        this.getFacebookUserDetail(res.authResponse.userID);
      } else {

        // Closing the loading
        this.facebookLoading.dismiss();
        
        // Showing the alert
        let alertController = this.alertController.create({
          title : "Feil under p&aring;logging!",
          message : "Facebook innlogging misslykkes, vennligst prøv igjen",
          buttons: ['OK']
        });
        alertController.present();
      }
    }).catch((e) => {

      // Closing the loading
      this.facebookLoading.dismiss();
      
      alert("Feil med facebook login " + e);
      console.log('Error logging into Facebook', e)
    });
  }

  // Fetching facebook user defails
  public getFacebookUserDetail(userid) {
    this.facebook.api("/" + userid + "/?fields=id,email,name,",["public_profile"]).then(res => {
        
      // Closing the loading
      this.facebookLoading.dismiss();
      var string = "";

      for(var key in res){
        string += key + ": " + res[key] + "<br>";
      }
      let alertController = this.alertController.create({
        title : "Verdier!",
        message : string,
        buttons: ['OK']
      });
      alertController.present();
      console.log(res);
        
    }).catch(e => {

      // Closing the loading
      this.facebookLoading.dismiss();

      console.log(e);
    });
  }
}
