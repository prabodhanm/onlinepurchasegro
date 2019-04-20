import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManageproductsProvider } from '../../providers/manageproducts/manageproducts';
import { CartserviceProvider } from '../../providers/cartservice/cartservice';
import { ViewcartPage } from '../cart/viewcart/viewcart'
import { ViewproductsPage} from '../products/viewproducts/viewproducts';
import {DetailcartPage} from '../cart/detailcart/detailcart';
import {EmptycartPage} from '../cart/emptycart/emptycart';

// import { FilePath } from '@ionic-native/file-path/ngx';
// import {File} from '@ionic-native/file/ngx';
import {GlobalProvider} from '../../providers/global/global';
import { OrdersPage } from '../../pages/orders/orders'
import Client from 'shopify-buy';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [GlobalProvider]
})
export class HomePage {

  products: any;
  cart : any = [];
  client : any;
  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };

  loginuser : string;
  imgcollection : any = [];
  slideOpts = {
    effect: 'flip'
  };

  totalmenuitems : number = 0;

  collectiondata : any = [];

  allcollectiondata : any = [];

  collectionitem : any = {
    "title" : "",
    "src" : "",
    "price" : 0,
    "products" : []
  }

  constructor(public navCtrl: NavController,
    private manageproducts : ManageproductsProvider,
    private storage: Storage, private cartservice : CartserviceProvider,
    private global : GlobalProvider) {
      this.client = Client.buildClient({
        domain: 'grocerium-exelic-poc.myshopify.com',
        storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
        // appId: '6'
      });

      this.storage.get("email").then((val : string) => {
        this.loginuser = val;
      });

      this.manageproducts.getproducts().then(products => {
        console.log('printing products in ionViewDidLoad method;')
        console.log(products);
        this.products= products;
      })

      this.storage.get('menuitems').then((val : number)=> {
        this.totalmenuitems = val;
      });

     this.getsubpages();
  }

  ionViewDidLoad(){
    this.storage.get("email").then((val : string) => {
      this.loginuser = val;
    });

    this.imgcollection = this.global.globalimages;


    // this.platform.ready().then(() => {
    //   this.file.listDir('./assets/img/slider','directory').then((result) => {
    //     for(let file of result){
    //       console.log('File Name ', file);
    //     }
    //   })
    // })
  }

  ionViewWillEnter() {
    this.storage.get('checkoutid').then((val:any) => {
      if(val == undefined || val == " "){
        this.cartservice.setcart([]);
      }
      else {
        this.storage.get('cart').then((val : any) => {
          console.log('Cart value ', val);
          if(val != null) {
            this.cart = val;
          }
          else {
            this.cart = [];
          }
          this.cartservice.setcart(this.cart);
        })
      }
      // this.storage.set('cart',[]);
      // this.cartservice.setcart([]);
      // this.cart = [];
      // this.storage.set('checkoutid', " ");
    });
    // this.cart = this.cartservice.getcart();

    this.storage.get("email").then((val : string) => {
      this.loginuser = val;
    });

  }

  showdetailitems(prod){
    this.cartservice.setproduct(prod);
    this.storage.set('prodid', prod.id);
    this.navCtrl.push(DetailcartPage);
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

 showproducts(collection) {
  console.log('collection in home ' , collection);
  // this.storage.set('products', collection.products);
  this.storage.set('prodcategory',collection.title);
  this.navCtrl.setRoot(ViewproductsPage);
 }

  getsubpages() {
    let subpages : any = [];

    let page : string;
    let re = /-/gi;
    let title : string;
    this.client.collection.fetchAllWithProducts()
    .then((collections) => {
      // this.collectiondata = collections;
      for(let collection of collections){
        console.log('Collection = ', collection);
         page = collection.handle.toLowerCase();
        //  page = page.replace(re,' ');
         if(page != 'frontpage'){
           console.log('Collection is ', collection);
          this.collectionitem.src = collection.products[0].images[0].src;
          this.collectionitem.price = collection.products[0].variants[0].price;
          title = this.toPascalCase(collection.handle.replace(re , ' '));
          this.collectionitem.title = title ;
          this.collectionitem.products = collection.products;

          this.collectiondata.push(this.collectionitem);
          this.allcollectiondata.push(collection);
          this.collectionitem  = {};
         }
      }
      console.log('Total Collectios in home ', this.allcollectiondata);
    }).catch((error) => {
      console.log(error);
    })


    // return subpages;
  }

  viewcart(){
    // console.log('You click the image');
    this.cart = this.cartservice.getcart();
    // this.router.navigateByUrl('viewmycart');

    console.log('Print cart details in home ', this.cart);
    if (this.cart.length > 0){
      this.navCtrl.push(ViewcartPage);
    }
    else {
      this.navCtrl.push(EmptycartPage);
    }
  }

  logout() {
    this.storage.set("email","");
    this.loginuser = "";

    this.storage.set("address1",null);
    this.storage.set("address2",null);
    this.storage.set("city",null);
    this.storage.set("country",null);
    this.storage.set("phone",null);
    this.storage.set("province",null);
    this.storage.set("zip",null);

    this.storage.set('checkoutid', " ");
  }

  getProduct() {
    this.manageproducts.getproducts()
    .then(res => {
      console.log(res);
      this.products = res;
    },
    err => {
      console.log(err);
    })
}

showorders() {
  this.navCtrl.setRoot(OrdersPage);
}
}
