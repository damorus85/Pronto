import { Component, HostListener } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

// Self made providers
import { ApiProvider } from '../../providers/api/api';

import { Storage } from '@ionic/storage';
import { TableNumberPage } from '../table-number/table-number';

// Self made modals
import { HomeMenuModalPage } from '../home-menu-modal/home-menu-modal';

/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {

  // Setting form valid to false
  public formValid = false;
  public trojan = false;

  // Constructor
  constructor(
    private modalController: ModalController,
    private barcode: BarcodeScanner,
    private storage: Storage,
    private alertController : AlertController,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    console.log(event);
    if(event.key == 'F9' || (event.shiftKey && event.key == 'M')){
      this.trojan = true;
    }
  }

  // Finding the customer method
  public findCustomer(customerid){
    
    // Starting the loading
    let loading = this.loadingController.create({
      content : "Finner restaurant..."
    });
    loading.present();

    // Sending the post data to the API
    this.apiProvider.get('/customer/get', {
      id : customerid
    }).subscribe((data) => {

      // Dismissing the loading
      loading.dismiss();

      // Checking status
      if(data.status !== true){

        let alertController = this.alertController.create({
          title : "Fant ikke!",
          message : "Det finnes ingen restauranter med dette nummeret. Vennligst pr&oslash;v igjen.",
          buttons: ['OK']
        });
        alertController.present();

      } else {
        // Saving the customer and redirecting to the table selector
        this.storage.set('pronto-sc', data.data);
        this.storage.set('pronto-sc-date', Date.now());
        this.navCtrl.push(TableNumberPage);
      }
      console.log(data);
    });
  }

  // Starting the scanner
  public enableScanner(){ 

    // Starting the scanner
    let barcodeScannerOptions : BarcodeScannerOptions = {
      resultDisplayDuration : 0,
      showTorchButton : true
    };
    this.barcode.scan(barcodeScannerOptions).then((result) => {

      // Check if result is not cancelled
      if(!result.cancelled){

        // Check if the result format is in QR code
        if(result.format == 'QR_CODE'){

          // Finding the customer
          this.findCustomer(result.text);
        } else {

          // Showing the incorrect barcode message
          let alert = this.alertController.create({
            title : "Ugyldig format!",
            message : "Du må scanne en QR-kode som du finner på border du sitter på eller i nærheten av der du sitter. Hør med betjeningen om du er usikker.",
            buttons: ['OK']
          });
          alert.present();
        }
      }
    });
  }

  // Opening settings
  openSettings(){
    let modal = this.modalController.create(HomeMenuModalPage);
    modal.present();
  }
  
  // Starting the scanner
  ionViewDidLoad(){
    this.enableScanner();
  }

  // Checking if form is valid
  checkValid(values){
    if(values.customerid != ""){
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }
}
