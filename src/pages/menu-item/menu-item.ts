import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';
import { ShoppingcartProvider } from '../../providers/shoppingcart/shoppingcart';

// Self made pages
import { ShoppingcartPage } from '../../pages/shoppingcart/shoppingcart';


/**
 * Generated class for the MenuItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-item',
  templateUrl: 'menu-item.html',
})
export class MenuItemPage {

  // Menu item values
  public customer;
  public customermenuitemid;
  public menuItem = {};
  public menu = {};
  public priceType;
  public currentPrice = 0;
  public priceIsSet = false;
  public amount = 1;
  public variants = [];
  public selectedVariant = null;
  public selectedVariantPrice;
  public selectedVariantLabel = null;
  public allergies = [];
  public cartTotal;
  public cartAmount;
  public selectedDoneness;
  public isClosed = false;
  

  // Constructor
  constructor(
    public toastController: ToastController,
    public shoppingcart: ShoppingcartProvider,
    private storage: Storage,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public navCtrl: NavController, public navParams: NavParams) {

      // Fetching the customer
      this.storage.get('pronto-sc').then((sc) => this.customer = sc);

      // Fetching the customer item number from param
      this.customermenuitemid = this.navParams.get('customermenuitemid');
  }

  // Startup
  ionViewDidLoad() {
    
    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Shopping total and amount
    this.shoppingcart.getTotalPrice().then((total) => this.cartTotal = total);
    this.shoppingcart.getTotalAmount().then((amount) => this.cartAmount = amount);

    // Fetching the menu item
    this.apiProvider.get("/customer/menuitem", {
      id : this.customermenuitemid
    }).subscribe((data) => {

      // Setting the menu items
      this.menuItem = data.data;
      this.menu = this.menuItem['menu'];
      
      // Checking closed menu
      this.checkActive();

      // Checking price
      if(this.menuItem['price'] != null && this.menuItem['price'] != ""){
        this.priceIsSet = true;
        this.priceType = data.data.price.type;

        // Checking price type
        if(this.priceType == 'dynamic'){
  
          // Setting menu item price variants
          this.variants = data.data.price.variants;
          this.currentPrice = this.variants[0].price;
  
          this.selectedVariant = this.variants[0];
          this.selectedVariantPrice = this.selectedVariant.price;
          this.selectedVariantLabel = this.selectedVariant.variant;
        } else {
  
          // Setting menu item static price data
          this.currentPrice = data.data.price.price;
          this.selectedVariantPrice = this.currentPrice;
        }
      }

      // Setting the allergies
      for(var index in data.data.allergiesLabels){
        this.allergies.push(String(data.data.allergiesLabels[index]));
      }
      
      // Cloading the loading
      loading.dismiss();
    });
  }

  // Checking if menu is active or not
  public checkActive(){
    // Fetching the active times
    let menuActiveStart = this.menuItem['menu']['active_start'];
    let menuActiveStop = this.menuItem['menu']['active_stop'];

    // Fetching now hours and minutes
    let date = new Date();
    let currentTime = parseInt(date.getHours() + '' + date.getMinutes());

    // Checking active
    if(menuActiveStart != "" && menuActiveStart != null && menuActiveStop != "" && menuActiveStop != null){

      // Creating int out of time
      menuActiveStart = parseInt(menuActiveStart.replace(/:/, ''));
      menuActiveStop = parseInt(menuActiveStop.replace(/:/, ''));
      
      // Checking required time
      if(currentTime < menuActiveStart || currentTime >= menuActiveStop){
        this.isClosed = true;
      }
    }
  }

  // Selecing vaiant
  selectVariant(variant){
    this.selectedVariant = variant;
    this.selectedVariantPrice = this.selectedVariant.price;
    this.selectedVariantLabel = this.selectedVariant.variant;
    this.calculatePrice();
  }

  // Decreasing the amount
  decreaseAmount(){
    if(this.amount > 1){
      this.amount--;
      this.calculatePrice();
    }
  }

  // Increasing the amount
  increaseAmount(){
    this.amount++;
    this.calculatePrice();
  }

  // Adding the the cart
  addTOCart(){
    
    // Checking if doneness is selected if required
    if(this.menuItem['doneness'] == '1' && this.selectedDoneness == null){
      let alert = this.alertController.create({
        message: 'Du m&aring; velge hvordan du vil ha kj&oslash;ttet stekt',
        buttons: ['OK']
      });
      alert.present();
    } else {

      // Starting the loading
      let loading = this.loadingController.create({
        content : "Laster vennligst vent..."
      });
      loading.present();

      // Adding the item to the cart
      this.shoppingcart.add(this.customermenuitemid, this.menuItem['label'], this.selectedVariantLabel, this.selectedDoneness, this.selectedVariantPrice, this.amount, this.currentPrice).then(() => {
        
        // Fetching the new cart total
        this.shoppingcart.getTotalPrice().then((total) => {
          this.cartTotal = total;
        });

        // Fetching the new cart amount
        this.shoppingcart.getTotalAmount().then((amount) => {
          this.cartAmount = amount;
        });
        loading.dismiss();

        // Resetting the amount and price
        this.amount = 1;
        this.calculatePrice();

        // Showing the toast
        let toast = this.toastController.create({
          message: this.menuItem['label'] + ' lagt til i handlekurven',
          duration: 2000,
          position: 'top'
        });
        toast.present();

        this.navCtrl.pop();
      });
    }
  }

  // Selecing doneness
  selectDoneness(doneness){
    this.selectedDoneness = doneness;
  }

  // Calculating the total price
  public calculatePrice(){
    this.currentPrice = this.selectedVariantPrice * this.amount;
  }

  // Navigating to the cart page
  gotoCart(){
    this.navCtrl.push(ShoppingcartPage);
  }
}
