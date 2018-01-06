import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';
import { ShoppingcartProvider } from '../../providers/shoppingcart/shoppingcart';

// Self made pages
import { ShoppingcartPage } from '../../pages/shoppingcart/shoppingcart';
import { MenuItemPage } from '../menu-item/menu-item';
import { MenuFilterPage } from '../menu-filter/menu-filter';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  // Public values
  public customermenuid;
  public menu = {};
  public menuItems = [];
  public loading;
  public menuHasLoaded = false;
  public menuItemsHasLoaded = false;
  public cartTotal;
  public cartAmount;
  public allergies = [];
  public vegetarian = false;

  // Custructor
  constructor(
    private events: Events,
    private storage: Storage,
    private modalController: ModalController,
    private shoppingcart: ShoppingcartProvider,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Fetching the customermenuid
      this.customermenuid = this.navParams.get('customermenuid');
  }

  // Goto menu item
  gotoMenuItem(customermenuitemid){
    this.navCtrl.push(MenuItemPage, {
      customermenuitemid : customermenuitemid
    });
  }
  
  // Checking if everything have loaded
  public checkLoaded(){
    if(this.menuHasLoaded && this.menuItemsHasLoaded){
      this.loading.dismiss();
    }
  }

  // Onload everytime
  ionViewWillEnter(){

    // Shopping total and amount
    this.shoppingcart.getTotalPrice().then((total) => this.cartTotal = total);
    this.shoppingcart.getTotalAmount().then((amount) => this.cartAmount = amount);

    // Fetching the menu
    this.apiProvider.get("/customer/menu", {
      id : this.customermenuid
    }).subscribe((data) => {
      this.menu = data.data;
    });

    // Fetching the menu items
    this.loadMenu();
  }

  // Loading the menu
  public loadMenu(){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching the filters
    return this.storage.get('pronto-filters-allergies').then((allergies) => {
      this.allergies = (allergies != null) ? allergies : [];

      // Fetching the menu items
      return this.apiProvider.get("/customer/menuitemsgrouped", {
        id : this.customermenuid,
        'allergies[]' : this.allergies
      }).subscribe((data) => {
        this.menuItems = data.data;
        loading.dismiss();
      });
    });
  }

  // Opening the filters
  openFilters(){

    this.events.subscribe('filters-set', () => {
      this.loadMenu();
      this.events.unsubscribe('filters-set');
    })

    let modal = this.modalController.create(MenuFilterPage);
    modal.present();
  }

  // Goto card page
  gotoCart(){
    this.navCtrl.push(ShoppingcartPage);
  }
}
