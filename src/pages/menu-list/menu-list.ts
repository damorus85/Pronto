import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Self made providers
import { ApiProvider } from '../../providers/api/api';
import { ShoppingcartProvider } from '../../providers/shoppingcart/shoppingcart';

// Self made pages
import { ShoppingcartPage } from '../../pages/shoppingcart/shoppingcart';
import { MenuPage } from '../menu/menu';
/**
 * Generated class for the MenuListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-list',
  templateUrl: 'menu-list.html',
})
export class MenuListPage {
  
  // Public values
  public customer = {};
  public menuList = [];
  public cartTotal;
  public cartAmount;

  // Constructor
  constructor(
    public shoppingcart: ShoppingcartProvider,
    private storage: Storage,
    private apiProvider: ApiProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  // Navigating to the selected menu
  gotoMenu(customermenuid){
    this.navCtrl.push(MenuPage, {
      customermenuid : customermenuid
    })
  }

  // Page will enter
  ionViewWillEnter(){
    // Shopping total and amount
    this.shoppingcart.getTotalPrice().then((total) => this.cartTotal = total);
    this.shoppingcart.getTotalAmount().then((amount) => this.cartAmount = amount);
  }

  // Page load
  ionViewDidLoad() {
    this.loadMenuList();
  }

  // Load menu list
  public loadMenuList(){
    
    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching the menus
    return this.storage.get('pronto-sc').then((customer) => {
      this.customer = customer;

      return this.apiProvider.get("/customer/menus", {
        id : this.customer['customerid']
      }).subscribe((data) => {
        this.menuList = this.removeExpiredMenus(data.data);
        loading.dismiss();
      });
    });
  }

  // Refreshing the menu list
  refreshMenuList(refresher){
    this.loadMenuList().then(() => {
      refresher.complete();
    });
  }

  // Filtering the list
  public removeExpiredMenus(menus){

    // Fetching now hours and minutes
    let date = new Date();
    let currentTime = parseInt(date.getHours() + '' + date.getMinutes());

    // Looping through the menus
    for(var key in menus){

      // Fetching the active times
      let menuActiveStart = menus[key].active_start;
      let menuActiveStop = menus[key].active_stop;

      // Checking active times
      menus[key].haveTime = false;
      if(menuActiveStart != "" && menuActiveStart != null && menuActiveStop != "" && menuActiveStop != null){

        // Creating int out of time
        menuActiveStart = parseInt(menuActiveStart.replace(/:/, ''));
        menuActiveStop = parseInt(menuActiveStop.replace(/:/, ''));
        
        // Checking required time
        menus[key].haveTime = true;
        if(currentTime < menuActiveStart || currentTime >= menuActiveStop){
          menus.splice(key, 1);
        }
      }
    }

    // Returning the remaining menus
    return menus;
  }
  
  // Navigating to the shopping cart
  gotoCart(){
    this.navCtrl.push(ShoppingcartPage);
  }
}
