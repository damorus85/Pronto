import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';
import { ShoppingcartProvider } from '../../providers/shoppingcart/shoppingcart';

// Self made pages
import { ShoppingcartPage } from '../../pages/shoppingcart/shoppingcart';
import { TableNumberPage } from '../table-number/table-number';
import { MenuPage } from '../menu/menu';
import { MenuListPage } from '../menu-list/menu-list';
import { OrdersPage } from '../orders/orders';

// Self made modals
import { HomeMenuModalPage } from '../home-menu-modal/home-menu-modal';
import { RatingModalPage } from '../rating-modal/rating-modal';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // Public values
  public customer = {};
  public user = {};
  public tablenumber;
  public cartTotal;
  public cartAmount;
  public haveOrders = false;
  public haveUnfinishedOrders = false;

  // Toasts
  public showToastTruncated = false;
 
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    private shoppingcart: ShoppingcartProvider,
    private storage: Storage,
    private alertController : AlertController,
    public navCtrl: NavController,
    public navParams: NavParams) {

      // Getting the selected customer and table number
      this.storage.get('pronto-sc').then((sc) => this.customer = sc);
      this.storage.get('pronto-user').then((user) => this.user = user);
      this.storage.get('pronto-tid').then((tid) => this.tablenumber = tid);

      // Checking nav params
      if(this.navParams.get('truncated') == 'truncated'){
        this.showToastTruncated = true;
      }
  }

  public loadHomePage(){
    // Shopping total and amount
    this.shoppingcart.getTotalPrice().then((total) => this.cartTotal = total);
    this.shoppingcart.getTotalAmount().then((amount) => this.cartAmount = amount);

    // Have orders
    return this.storage.get('pronto-user').then((user) => {
      this.apiProvider.get('/order/getuserdayorders', {
        id : user['serviceuserid'],
        customerid : this.customer['customerid']
      }).subscribe((data) => {
        if(data.status == true){
          if(data.data.length > 0){
            this.haveOrders = true;
          }
          for(var key in data.data){
            if(data.data[key].status < 2){
              this.haveUnfinishedOrders = true;
              break;
            }
          }
        }
      });
    });
  }

  // Loading each time
  ionViewWillEnter(){
    this.loadHomePage();
  }

  // First time load
  ionViewDidLoad(){

    // Truncated toast
    if(this.showToastTruncated){
      let toast = this.toastController.create({
        message: 'Handlekurv tømt',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  }

  // Refreshing home page
  refreshHome(refresher){
    this.loadHomePage().then(() => refresher.complete());
  }
  
  // Change table number
  changeTableNumber(){

    // Presenting the 
    let confirm = this.alertController.create({
      title: 'Bytte bordnummer?',
      message: (this.haveUnfinishedOrders) ? 'Du har ordre som er på vei, om du bytter bord n&aring; m&aring; du s&oslash;rge for at servit&oslash;ren finner deg' : 'Er du sikker p&aring; at du vil bytte bord?',
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Bytt bord',
          handler: () => {
            this.storage.remove('pronto-tid');
            this.navCtrl.setRoot(TableNumberPage);
          }
        }
      ]
    });
    confirm.present();

  }

  // Opening settings
  openSettings(){
    let modal = this.modalController.create(HomeMenuModalPage);
    modal.present();
  }

  // Goto single menu
  gotoMenu(customermenuid){
    this.navCtrl.push(MenuPage, {
      customermenuid : customermenuid
    })
  }

  // Goto menu list
  gotoMenus(){
    this.navCtrl.push(MenuListPage);
  }

  // Goto orders
  gotoOrders(){
    this.navCtrl.push(OrdersPage);
  }

  // Goto cart
  gotoCart(){
    this.navCtrl.push(ShoppingcartPage);
  }

  // Calling the waiter
  callWaiter(){

    // Presenting the confirm
    let confirm = this.alertController.create({
      title: 'Tilkalle betjeningen?',
      message: 'Vil du tilkalle betjeningen?',
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Tilkall betjeningen',
          handler: () => {
            
            // Starting the loading
            let loading = this.loadingController.create({
              content : "Laster vennligst vent..."
            });
            loading.present();

            // Inserting the callout for waiter
            this.apiProvider.post('/customer/callout', {
              customerid : this.customer['customerid'],
              serviceuserid : this.user['serviceuserid'],
              tablenumber : this.tablenumber,
              type : 'waiter',
              status : 0
            }).subscribe((data) => {
              loading.dismiss();

              if(data.status == true){
                
                // Success message
                let toast = this.toastController.create({
                  message: 'Betjeningen er tilkallt',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();

              } else {

                // Error message
                let alert = this.alertController.create({
                  title: 'Noe skjedde!',
                  message: 'Det oppstod noen problemer med tilkallingen av betjeningen, vennligst prøv igjen',
                  buttons: ['OK']
                });
                alert.present();
              }
            });
          }
        }
      ]
    });
    confirm.present();
  }

  // Asking for the check
  getTheCheck(){

    // Presenting the confirm
    let confirm = this.alertController.create({
      title: 'Be om regningen?',
      message: 'Vil du be om regningen?',
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Be om regningen',
          handler: () => {
            
            // Starting the loading
            let loading = this.loadingController.create({
              content : "Laster vennligst vent..."
            });
            loading.present();

            // Inserting the callout for waiter
            this.apiProvider.post('/customer/callout', {
              customerid : this.customer['customerid'],
              serviceuserid : this.user['serviceuserid'],
              tablenumber : this.tablenumber,
              type : 'getthecheck',
              status : 0
            }).subscribe((data) => {
              loading.dismiss();

              if(data.status == true){
                
                // Success message
                let toast = this.toastController.create({
                  message: 'Betjeningen er tilkallt om regningen',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();

              } else {

                // Error message
                let alert = this.alertController.create({
                  title: 'Noe skjedde!',
                  message: 'Det oppstod noen problemer med tilkallingen av regningen, vennligst prøv igjen',
                  buttons: ['OK']
                });
                alert.present();
              }
            });
          }
        }
      ]
    });
    confirm.present();
  }

  // Closing the visit
  closeVisit(){
    
    // Presenting the confirm
    let confirm = this.alertController.create({
      title: 'Avslutte besøket?',
      message: 'Er du sikker p&aring; at du vil avslutte besøket?',
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Avslutt',
          handler: () => {
            
            // Opening the modal page
            let modal = this.modalController.create(RatingModalPage);
            modal.present();
          }
        }
      ]
    });
    confirm.present();
  }
}
