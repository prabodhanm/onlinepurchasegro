import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManageproductsProvider } from '../../providers/manageproducts/manageproducts';
import { CartserviceProvider } from '../../providers/cartservice/cartservice';
import { ViewcartPage } from '../cart/viewcart/viewcart'
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

  constructor(public navCtrl: NavController,
    private manageproducts : ManageproductsProvider,
    private storage: Storage, private cartservice : CartserviceProvider,
    private global : GlobalProvider) {
      this.client = Client.buildClient({
        domain: 'grocerium-exelic-poc.myshopify.com',
        storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
        // appId: '6'
      });

      this.manageproducts.getproducts().then(products => {
        console.log('printing products in ionViewDidLoad method;')
        console.log(products);
        this.products= products;
      })

      this.storage.get('menuitems').then((val : number)=> {
        this.totalmenuitems = val;
      });

     // this.getsubpages();
  }

  ionViewDidLoad(){
    this.storage.get("email").then((val : string) => {
      this.loginuser = val;
    });

    this.imgcollection = this.global.globalimages;

    this.getsubpages();
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
    });
    this.cart = this.cartservice.getcart();
  }

  getsubpages() {
    let subpages : any = [];

    let page : string;
    // let re = /-/gi;
    this.client.collection.fetchAllWithProducts()
    .then((collections) => {
      // this.collectiondata = collections;
      for(let collection of collections){
        console.log('Collection = ', collection);
         page = collection.handle.toLowerCase();
        //  page = page.replace(re,' ');
         if(page != 'frontpage'){
          this.collectiondata.push(collection);
         }
      }
      console.log('Total Collectios in home ', this.collectiondata);
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
  this.navCtrl.push(OrdersPage);
}
}
