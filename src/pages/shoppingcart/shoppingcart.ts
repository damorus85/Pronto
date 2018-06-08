import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';

// Self made providers
import { ApiProvider } from '../../providers/api/api';
import { ShoppingcartProvider } from '../../providers/shoppingcart/shoppingcart';

// Self made pages
import { HomePage } from '../../pages/home/home';
import { MenuItemCommentPage } from '../../pages/menu-item-comment/menu-item-comment';

/**
 * Generated class for the ShoppingcartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-shoppingcart',
  templateUrl: 'shoppingcart.html',
})
export class ShoppingcartPage {

  // Public values
  public cart = [];
  public cartTotal;
  public comment;
  public activeSubmit = true;
  public deviceToken = "";

  // User and customer
  public customer = {};
  public user = {};
  public allergies = [];
  public tablenumber;

  // Soft payments
  public isSoftPayment = false;
  public softPayments = [];
  public selectedSoftPayment = "";

  constructor(
    private keyboard: Keyboard,
    public storage: Storage,
    public toastController: ToastController,
    private shoppingcart: ShoppingcartProvider,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Fetching the device token
      this.storage.get('pronto-d-t').then((token) => this.deviceToken = token);

      // Getting the selected customer and table number
      this.storage.get('pronto-tid').then((tid) => this.tablenumber = tid);
      this.storage.get('pronto-user').then((user) => this.user = user);
      this.storage.get('pronto-filters-allergies').then((allergies) => this.allergies = allergies);
      this.storage.get('pronto-sc').then((sc) => {
        this.customer = sc;

        // Checking soft payments
        if(this.customer['softpayment'] == 1){
          this.activeSubmit = false;
          this.isSoftPayment = true;
          this.softPayments = this.customer['softpayments'];
        }
      });

      // Showing the keyboard controls menu
      this.keyboard.hideKeyboardAccessoryBar(false);
  }

  // Loading the cart
  public loadCart(){
    
    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching the cart total
    this.shoppingcart.getTotalPrice().then((total) => this.cartTotal = total);
    
    // Fetching the cart
    return this.shoppingcart.get().then((cart) => {
      this.cart = cart;
      loading.dismiss(); 
    });
  }

  // Page load
  ionViewWillEnter() {
    
    // Loading the cart
    this.loadCart();

    // Loading the comment
    this.storage.get('pronto-cart-comment').then((comment) => this.comment = comment);
  }

  // Leaving the page
  ionViewWillLeave(){

    // Saving the comment
    this.storage.set('pronto-cart-comment', this.comment);
  }

  // Goto menu item comment
  changeComment(key){
    this.navCtrl.push(MenuItemCommentPage, {
      key : key 
    });
  }

  // Saving the comment to local var
  saveComment(value){
    this.comment = value;
  }

  // Refreshing the cart
  refreshCart(refresher){
    this.loadCart().then(() => {
      refresher.complete();
    });
  }

  // Increasing the amount of an item
  increaseAmount(itemid){
    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Removing the item from the cart
    this.shoppingcart.increaseItemAmount(itemid, 1).then(() => {
      
      // Fetching the cart
      this.shoppingcart.get().then((cart) => {
        this.cart = cart;
        loading.dismiss();
      });

      // Fetching the cart total
      this.shoppingcart.getTotalPrice().then((total) => this.cartTotal = total);

    });
  }

  // Decreasing the amount of an item
  decreaseAmount(itemid, currentAmount){
    if(currentAmount > 1){
      // Starting the loading
      let loading = this.loadingController.create({
        content : "Laster vennligst vent..."
      });
      loading.present();

      // Removing the item from the cart
      this.shoppingcart.decreaseItemAmount(itemid, 1).then(() => {
        
        // Fetching the cart total
        this.shoppingcart.getTotalPrice().then((total) => {this.cartTotal = total});

        // Fetching the cart
        this.shoppingcart.get().then((cart) => {
          this.cart = cart;
          loading.dismiss();
        });
      });
    }
  }

  // Removing an item from the cart
  removeItem(itemid, label){

    // Presenting the confirm
    let confirm = this.alertController.create({
      title: 'Fjerne ' + label + '?',
      message: 'Er du sikker p&aring; at du vil fjerne ' + label + '?',
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Fjern',
          handler: () => {

            // Starting the loading
            let loading = this.loadingController.create({
              content : "Laster vennligst vent..."
            });
            loading.present();

            // Removing the item from the cart
            this.shoppingcart.remove(itemid).then(() => {
              
              // Fetching the cart
              this.shoppingcart.get().then((cart) => {
                this.cart = cart;
                loading.dismiss();

                // Showing the toast
                let toast = this.toastController.create({
                  message: label + ' fjernet fra handlekurven',
                  duration: 2000,
                  position: 'top'
                });
                toast.present();
              });

              // Fetching the cart total
              this.shoppingcart.getTotalPrice().then((total) => this.cartTotal = total);
              console.log(this.cartTotal);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  // Placing the order
  placeOrder(){

    // Presenting the confirm
    let confirm = this.alertController.create({
      title: 'Sende bestilling?',
      message: 'Er du sikker p&aring; at du vil sende bestillingen?',
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Send bestilling',
          handler: () => {
            
            // Starting the loading
            let loading = this.loadingController.create({
              content : "Legger inn din ordre, vennligst vent..."
            });
            loading.present();

            // Creating the lines 
            let lines = [];
            for(var key in this.cart){
              lines.push({
                customermenuitemid : this.cart[key].itemid,
                variantlabel : this.cart[key].variantLabel,
                doneness : this.cart[key].doneness,
                amount : this.cart[key].amount,
                price : this.cart[key].price,
                total : this.cart[key].total,
                comment : this.cart[key].comment
              });
            }

            // Placing the order
            this.apiProvider.post('/order', {
              customerid : this.customer['customerid'],
              serviceuserid : this.user['serviceuserid'],
              tablenumber : this.tablenumber,
              total : this.cartTotal,
              status : 0, // Default to placed order
              comment : this.comment,
              softpayment: this.selectedSoftPayment,
              token: this.deviceToken,
              allergies : this.allergies,
              lines : lines
            }).subscribe((data) => {
              loading.dismiss();

              // Checking the status
              if(data.status == true){
                
                // Cleaning up the cart
                this.storage.remove('pronto-cart-comment');
                this.shoppingcart.truncate();

                // Showing the alert
                let alert = this.alertController.create({
                  title: 'Ordre lagt inn',
                  message: 'Ordren er lagt inn og vil komme til ditt bord',
                  buttons: [
                    {
                      text: 'OK',
                      handler: () => {
                        this.navCtrl.setRoot(HomePage);
                      }
                    }
                  ]
                });
                alert.present();

              } else {
                // Showing the alert
                let alert = this.alertController.create({
                  title: 'Oops!',
                  message: 'Det oppstod en feil. Vennligst kontakt betjeningen',
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

  // Truncating the cart and returning to the home page
  truncateCart(){

    // Presenting the confirm
    let confirm = this.alertController.create({
      title: 'T&oslash;mme handlekurv?',
      message: 'Er du sikker p&aring; at du vil t&oslash;mme handlekurven din?',
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Tøm handlekurn',
          handler: () => {
            this.storage.remove('pronto-cart-comment');
            this.shoppingcart.truncate().then(() => {
              this.navCtrl.setRoot(HomePage, {
                truncated : 'truncated'
              });
            });
          }
        }
      ]
    });
    confirm.present();
  }

  // Selecing soft payment
  selectSoftPayment(payment){
    this.selectedSoftPayment = payment;
    this.activeSubmit = true;
  }
}
