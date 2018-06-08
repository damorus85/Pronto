import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

// Self made providers
import { ShoppingcartProvider } from '../../providers/shoppingcart/shoppingcart';

/**
 * Generated class for the MenuItemCommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-item-comment',
  templateUrl: 'menu-item-comment.html',
})
export class MenuItemCommentPage {

  // Public values
  public key;
  public menuItem = {};
  public comment = null;

  // Constructor
  constructor(
    private shoppingcart: ShoppingcartProvider,
    private loadingController: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams) {

      // Fething the key
      this.key = this.navParams.get('key');
  }

  // Startup
  ionViewDidLoad() {

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    // Fetching the item
    this.shoppingcart.getItem(this.key).then((menuItem) => {
      this.menuItem = menuItem;
      this.comment = menuItem.comment;

      // Closing the loading
      loading.dismiss();
    });
  }

  // Removing the comment
  truncateComment(){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present();

    this.shoppingcart.changeComment(this.key, null).then(() => {
      loading.dismiss();
      this.navCtrl.pop();
    });
  }

  // Updating the comment variable
  updateComment(){

    // Starting the loading
    let loading = this.loadingController.create({
      content : "Laster vennligst vent..."
    });
    loading.present(); 

    this.shoppingcart.changeComment(this.key, this.comment).then(() => {
      loading.dismiss();
      this.navCtrl.pop();
    });
  }

  // Updating the comment
  saveComment(value){
    this.comment = value;
  }
}
