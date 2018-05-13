// Imports
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
//import { AngularFireModule } from 'angularfire2';
//import { AngularFirestoreModule } from 'angularfire2/firestore';

// Native app
import { MyApp } from './app.component';

// Native providers
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Facebook } from '@ionic-native/facebook';
import { Keyboard } from '@ionic-native/keyboard';
//import { Firebase } from '@ionic-native/firebase';

// Self made providers
import { ApiProvider } from '../providers/api/api';
import { ShoppingcartProvider } from '../providers/shoppingcart/shoppingcart';

// Self made pipes
//import { PriceFormatPipe } from '../pipes/price-format/price-format';
import { PipesModule } from '../pipes/pipes.module';

// Pages
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgottenPage } from '../pages/forgotten/forgotten';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { ScanPage } from '../pages/scan/scan';
import { TableNumberPage } from '../pages/table-number/table-number';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { MenuListPage } from '../pages/menu-list/menu-list';
import { MenuFilterPage } from '../pages/menu-filter/menu-filter';
import { MenuItemPage } from '../pages/menu-item/menu-item';
import { ProfilePage } from '../pages/profile/profile';
import { ShoppingcartPage } from '../pages/shoppingcart/shoppingcart';
import { OrdersPage } from '../pages/orders/orders';
import { OrderHistoryPage } from '../pages/order-history/order-history';
import { OrderHistoryListPage } from '../pages/order-history-list/order-history-list';
import { OrderDetailsPage } from '../pages/order-details/order-details';

// Modal pages
import { HomeMenuModalPage } from '../pages/home-menu-modal/home-menu-modal';
import { RatingModalPage } from '../pages/rating-modal/rating-modal';
//import { FcmProvider } from '../providers/fcm/fcm';

// Firebase values
const firebase = {
  apiKey: 'AIzaSyDQiOMYjbYKm69XVt-pRHG1UZB3FbJvqWg',
  authDomain: 'pronto-c1e7a.firebaseapp.com',
  databaseURL: 'https://pronto-c1e7a.firebaseio.com/',
  projectId: 'pronto-c1e7a',
  storageBucket: 'pronto-c1e7a.appspot.com',
  messagingSenderId: '168268545225'
}

@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    LoginPage,
    RegisterPage,
    ForgottenPage,
    ResetPasswordPage,
    ScanPage,
    TableNumberPage,
    HomePage,
    HomeMenuModalPage,
    RatingModalPage,
    MenuPage,
    MenuListPage,
    MenuItemPage,
    MenuFilterPage,
    ProfilePage,
    ShoppingcartPage,
    OrdersPage,
    OrderDetailsPage,
    OrderHistoryPage,
    OrderHistoryListPage,
  ],
  imports: [
    FormsModule,
    HttpModule,
    PipesModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms:{
        ios : {
          backButtonText: 'Tilbake'
        }
      }
    }),
    IonicStorageModule.forRoot(),
    //AngularFireModule.initializeApp(firebase),
    //AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashPage,
    LoginPage,
    RegisterPage,
    ForgottenPage,
    ResetPasswordPage,
    ScanPage,
    TableNumberPage,
    HomePage,
    HomeMenuModalPage,
    RatingModalPage,
    MenuPage,
    MenuFilterPage,
    MenuListPage,
    MenuItemPage,
    ProfilePage,
    ShoppingcartPage,
    OrdersPage,
    OrderHistoryPage,
    OrderHistoryListPage,
    OrderDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    ShoppingcartProvider,
    Facebook,
    Keyboard,
    //FcmProvider,
    //Firebase
  ]
})
export class AppModule {}
