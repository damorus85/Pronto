import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the ShoppingcartProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const CART_TAG = 'pronto-cart';

@Injectable()
export class ShoppingcartProvider {

  // Fetching the current shopping cart
  constructor(public storage: Storage) {
  }
  /**
   * Adding items to the shopping cart
   * 
   * @param int itemid 
   * @param string label 
   * @param string variantLabel 
   * @param float price 
   * @param int amount 
   * @param float total 
   * @return void
   */
  public add(itemid, label, variantLabel, doneness, price, amount, total, comment){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      // Checking empty cart
      if(shoppingcart == null){
        shoppingcart = [];
      }

      // Add or increase
      let add = true;
      for(var key in shoppingcart){
        // Checking increasing or adding
        if(
          shoppingcart[key].itemid == itemid && 
          shoppingcart[key].variantLabel == variantLabel && 
          shoppingcart[key].price == price && 
          shoppingcart[key].doneness == doneness
        ){
          // Increasing
          shoppingcart[key].amount += amount;
          shoppingcart[key].total += total;
          add = false;
          break;
        }
      }

      // Checking add
      if(add){
        shoppingcart.push({
          itemid : itemid,
          label : label,
          variantLabel : variantLabel,
          doneness : doneness,
          price : price,
          amount : amount,
          total : total,
          comment : comment
        });
      }
      
      // Saving
      this.storage.set(CART_TAG, shoppingcart);
    });
  }
  /**
   * Increasing the amount of items
   * 
   * @param int itemid
   * @param int amount
   */
  public increaseItemAmount(itemid, amount){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      if(shoppingcart != null){
        for(var key in shoppingcart){
          if(shoppingcart[key].itemid == itemid){
            // Increasing
            shoppingcart[key].amount += amount;
            shoppingcart[key].total += ( amount * shoppingcart[key].price );
            break;
          }
        }
        this.storage.set(CART_TAG, shoppingcart);
      }
    });
  }
  /**
   * Decreasing the amount of items
   * 
   * @param int itemid
   * @param int amount
   */
  public decreaseItemAmount(itemid, amount){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      if(shoppingcart != null){
        for(var key in shoppingcart){
          if(shoppingcart[key].itemid == itemid){
            if(( shoppingcart[key].amount - amount) > 0){
              // Decreasing
              shoppingcart[key].amount -= amount;
              shoppingcart[key].total -= ( amount * shoppingcart[key].price );
            } else {
              // Setting to one item
              shoppingcart[key].amount = 1;
              shoppingcart[key].total = shoppingcart[key].price;
            }
            break;
          }
        }
        this.storage.set(CART_TAG, shoppingcart);
      }
    });
  }
  /**
   * Removing a shopping cart item
   * 
   * @param int itemid 
   * @returns void
   */
  public remove(itemid){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      if(shoppingcart != null){
        for(var key in shoppingcart){
          if(shoppingcart[key].itemid == itemid){
            shoppingcart.splice(key, 1);
            break;
          }
        }
        this.storage.set(CART_TAG, shoppingcart);
      }
    });
  }
  /**
   * Changing the comment of a menuitem
   * 
   * @param key 
   * @param comment 
   */
  public changeComment(key, comment){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      if(shoppingcart != null){
        if(shoppingcart[key] != undefined){
          shoppingcart[key]['comment'] = comment;
          return this.storage.set(CART_TAG, shoppingcart);
        }
      }
    });
  }
  /**
   * Truncating the cart
   * 
   * @returns void
   */
  public truncate(){
    return this.storage.remove(CART_TAG);
  }
  /**
   * Fetching the shopping cart
   * 
   * @returns array
   */
  public get(){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      return shoppingcart;
    });
  }
  /**
   * Fetching a single item
   * 
   * @param key
   */
  public getItem(key){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      return shoppingcart[key] != undefined ? shoppingcart[key] : false; 
    });
  }
  /**
   * Fething the current total price in the cart
   * 
   * @return float
   */
  public getTotalPrice(){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      if(shoppingcart == null){
        return 0;
      } else {
        let totalPrice = 0;
        for(var key in shoppingcart){
          totalPrice += shoppingcart[key].total;
        }
        return totalPrice;
      }
    });
  }
  /**
   * Fetching the current amount of items in the shopping cart
   * 
   * @return int
   */
  public getTotalAmount(){
    return this.storage.get(CART_TAG).then((shoppingcart) => {
      if(shoppingcart == null){
        return 0;
      } else {
        let amount = 0;
        for(var key in shoppingcart){
          amount += shoppingcart[key].amount;
        }
        return amount;
      }
    });
  }
}
