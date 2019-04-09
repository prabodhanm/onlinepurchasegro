// import { Component, ViewChild } from '@angular/core';
// import { Platform } from 'ionic-angular';
// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { Nav, MenuController  } from 'ionic-angular';
// import { HomePage } from '../pages/home/home';
// import { ViewproductsPage } from '../pages/products/viewproducts/viewproducts';
// import { ManageproductsProvider } from '../providers/manageproducts/manageproducts';
// // import { OrdersPage } from '../pages/orders/orders'
// import {AboutUsPage} from '../pages/about-us/about-us';
// import { LoginPage } from '../pages/public/login/login';
// import {RegisterPage} from '../pages/public/register/register';
// import { Storage } from '@ionic/storage';
// import Client from 'shopify-buy';

// import { HomePage } from '../pages/home/home';
// @Component({
//   templateUrl: 'app.html'
// })
// export class MyApp {
//   rootPage:any = HomePage;

//   constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
//     platform.ready().then(() => {
//       // Okay, so the platform is ready and our plugins are available.
//       // Here you can do any higher level native things you might need.
//       statusBar.styleDefault();
//       splashScreen.hide();
//     });
//   }
// }



import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Nav, MenuController  } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { ViewproductsPage } from '../pages/products/viewproducts/viewproducts';
import { ManageproductsProvider } from '../providers/manageproducts/manageproducts';
// import { OrdersPage } from '../pages/orders/orders'
import {AboutUsPage} from '../pages/about-us/about-us';
import { LoginPage } from '../pages/public/login/login';
import {RegisterPage} from '../pages/public/register/register';


import { Storage } from '@ionic/storage';
import Client from 'shopify-buy';
// import Client from 'shopify-buy';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav :Nav;
  rootPage:any = HomePage;
//private navCtrl : NavController,

  // pages : Array<{title:string,component:any, url:string}>;

  pages : any;
  selectedMenu: any;
  showLevel1 = null;
  showLevel2 = null;
  products : any;
  filterproducts : any = [];
  morefilterproducts : any = [];
  isSearchbarOpened : boolean = false;
  client : any;

  // splashScreen: SplashScreen,statusBar: StatusBar,

  constructor(platform: Platform,
      private manageproducts : ManageproductsProvider,
     private menuCtrl : MenuController, private storage : Storage,
     private statusBar  : StatusBar, private splashScreen : SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.client = Client.buildClient({
      domain: 'grocerium-exelic-poc.myshopify.com',
      storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
      // appId: '6'
    });

    this.pages = [
      {title:'Home',component:HomePage, url:'home'},
      {
        title:'Products',
        subpages : this.getsubpages(),
        component:ViewproductsPage,
        url:''
      },
      {title:'About Us',component:AboutUsPage, url:''},
      // {title:'Orders',component:OrdersPage, url:'home'},
      {title:'Sign In',component:LoginPage, url:'log-in'},
      {title:'Create An Account',component:RegisterPage, url:'person-add'}
    ]

    console.log('Total menuitems ', this.pages.length);
    this.storage.set('menuitems',this.pages.length);

  }

  getsubpages() {
    let subpages : any = [];
    let singlesubpage : any;
    let page : string;
    let re = /-/gi;
    this.client.collection.fetchAllWithProducts()
    .then((collections) => {
      // console.log(this.prodsearch.replace(re,'-'));
      for(let collection of collections){
         page = collection.handle.toLowerCase();
         page = page.replace(re,' ');
         page = this.toPascalCase(page);
         if(page != 'Frontpage'){
          singlesubpage = {"title": page , "component" : ViewproductsPage};
          subpages.push(singlesubpage);
         }
      }
    }).catch((error) => {
      console.log(error);
    })

    return subpages;
  }

  getproductsubpages() {
    let subpages : any = [];
    let prodcategory : any = [];
    let singlesubpage : any;

    let prodcheck : string;
    for(let prod of this.products) {

      if(prod.tags == "atta"){
        prodcheck = "Chakki Fresh Atta";
      }
      else {
        prodcheck = this.toPascalCase(prod.tags)
      }
      // //console.log('product in getproductsubpages is ', prod);
      if(!prodcategory.includes(prodcheck) && !(prod.tags == "") && !(prod.tags == "spicies") ) {
        prodcategory.push(prodcheck);
        this.filterproducts.push(prod);
      }

    }

    console.log('filter product category ', this.filterproducts);
    this.storage.set('filterproducts',this.filterproducts);

    console.log('Product category is ', prodcategory);
    for( let prod of prodcategory) {
      singlesubpage = {"title": prod , "component" : ViewproductsPage};
      subpages.push(singlesubpage);
    }
    console.log('Sub pages ' , subpages);

  }

  filtermoreproducts(productcategory) {
    console.log('category name in filter more products in app ', productcategory);

    this.morefilterproducts = [];
    for(let prod of this.products){
      if(productcategory === 'Chakki Fresh Atta'){
        productcategory = "atta";
      }

      if(prod.tags.toLowerCase() == productcategory.toLowerCase()){
        this.morefilterproducts.push(prod);
      }
    }

    console.log('More filer products ', this.morefilterproducts);
    console.log('filter products in filtermoreproducts ', this.morefilterproducts);
    this.storage.set('filterproducts',this.morefilterproducts);
  }


  getItems(event){
    this.morefilterproducts = [];
    let serVal = event.value;
    this.storage.set('prodcategory',serVal.toLowerCase());
    this.menuCtrl.close();
    this.nav.setRoot(ViewproductsPage);
  }

  toPascalCase(str){
     let returnval : string = "";
      str = str.toLowerCase().split(' ');
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        if(i < str.length -1){
          returnval += str[i] + " ";
        }
        else {
          returnval += str[i] ;
        }
      }
    return returnval;
  }

  getadminproducts() {
    return this.manageproducts.getAdminProducts().subscribe((result : any) => {
      console.log('Admin products in viewproducts ', result);
      this.products = result.products;
      this.storage.set('baseproducts',this.products);
      return this.getproductsubpages();
    }, (error)=> {
      console.log('Error occurred ', error.error);
    });

  }

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };

  toggleLevel1(page, idx, index) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      if(page.subpages){
        this.showLevel1 = idx;
      }

      this.openPage(page,index);
    }
  };

  toggleLevel2(page,idx, index, productcategory) {
    console.log('Page clicked in toogleLevel2 ', productcategory);
    this.storage.set('prodcategory',productcategory);
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      console.log('else part of toggleLevel2');
      this.showLevel1 = idx;
      this.showLevel2 = idx;
      // console.log('products in togglelevel2 ', this.products);
      //this.filtermoreproducts(productcategory);
      console.log('Open page now...');
      this.openPage(page,index);
    }
  };

  openPage(page, index) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log('printing page ', page );
    console.log('print index ' , index);
    console.log(page.component);


    if (page.subpages) {
      console.log('Page is having sub pages...');
      if (this.selectedMenu) {
        this.selectedMenu = 0;
      } else {
        this.selectedMenu = index;
      }
    } else {
      console.log('Opening a page...');
      //filter the products

      this.nav.setRoot(page.component);
      this.menuCtrl.close();
    }
  }
}

