// Imports
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';

// Native app
import { MyApp } from './app.component';

// Native providers
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Facebook } from '@ionic-native/facebook';
import { HTTP } from '@ionic-native/http';

// Self made providers
import { ApiProvider } from '../providers/api/api';
import { LoginProvider } from '../providers/login/login';
import { ShoppingcartProvider } from '../providers/shoppingcart/shoppingcart';

// Self made pipes
import { PriceFormatPipe } from '../pipes/price-format/price-format';
import { AllergiesFormatPipe } from '../pipes/allergies-format/allergies-format';

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
import { OrderDetailsPage } from '../pages/order-details/order-details';

// Modal pages
import { HomeMenuModalPage } from '../pages/home-menu-modal/home-menu-modal';
import { RatingModalPage } from '../pages/rating-modal/rating-modal';


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
    PriceFormatPipe,
    AllergiesFormatPipe
  ],
  imports: [
    FormsModule,
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms:{
        ios : {
          backButtonText: 'Tilbake'
        }
      }
    }),
    IonicStorageModule.forRoot()
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
    OrderDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    LoginProvider,
    ShoppingcartProvider,
    Facebook,
    HTTP
  ]
})
export class AppModule {}
