import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

// Self made pages
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login'; 
import { ScanPage } from '../pages/scan/scan';
import { TableNumberPage } from '../pages/table-number/table-number';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // Setting root page to loading spash page
  rootPage:any = SplashPage;

  // Contructor
  constructor(
    private storage: Storage,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen) {
    platform.ready().then(() => {
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
      // Checking if logged in
      this.storage.get('pronto-user').then((user) => {
        if(user == null){

          // Navigating to login page
          this.rootPage = LoginPage;
        } else {

          // Checking if you have selected customer
          this.storage.get('pronto-sc').then((scid) => {
            if(scid == null){

              // Navigating to scan page
              this.rootPage = ScanPage;
            } else {
              
              // Checking expired date
              this.storage.get('pronto-sc-date').then((scdate) => {
                var validDate = true;
                if(scdate != null){
                  let now = Date.now();
                  if((now - scdate) > 28800000){
                    this.storage.remove('pronto-tid');
                    this.storage.remove('pronto-sc');
                    this.storage.remove('pronto-sc-date');
                    this.storage.remove('pronto-cart');
                    this.storage.remove('pronto-cart-comment');

                    // Navigating to scan page
                    this.rootPage = ScanPage;
                    validDate = false;
                  }
                }
                if(validDate){
                  // Checking if you have selected table
                  this.storage.get('pronto-tid').then((tid) => {
                    if(tid == null){

                      // Navigating to scan page
                      this.rootPage = TableNumberPage; // TODO Add the table-select page
                    } else {
                      this.rootPage = HomePage;
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }
}

