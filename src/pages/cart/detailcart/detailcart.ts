import { Component, ViewChild } from '@angular/core';
// import { IonicPage, Nav, NavController, NavParams } from 'ionic-angular';
import {  Nav, NavController, NavParams } from 'ionic-angular';
import Client from 'shopify-buy';
import { Storage } from '@ionic/storage';
import { ViewproductsPage } from '../../../pages/products/viewproducts/viewproducts';
import { CartserviceProvider } from '../../../providers/cartservice/cartservice';
import { ViewcartPage } from '../../cart/viewcart/viewcart';

/**
 * Generated class for the DetailcartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-detailcart',
  templateUrl: 'detailcart.html',
})
export class DetailcartPage {
  @ViewChild('content') nav :Nav;
  prod : any;
  checkoutid : string;
  prodcheckout: any;
  client: any;
  loginuser : string;
  prodid : string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private cartservice : CartserviceProvider, private storage: Storage) {
    this.prod = this.cartservice.getproduct();

      this.storage.get('prodid').then((val : string) => {
        this.prodid = val;
      })
    console.log('prodcut details in detailcart constructor ', this.prod);
    this.client = Client.buildClient({
      domain: 'grocerium.exeliqconsulting.com',
      storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
    });

    console.log('In detail cart constructor...');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailcartPage');
    this.storage.set("currenpage","detailcart");

    this.storage.get("email").then((val : string) => {
      this.loginuser = val;
    });

    this.storage.get('checkoutid').then((val : string)=> {
      this.checkoutid = val;
    })
  }

  openviewproduct() {
    // this.navCtrl.push(ViewproductsPage);
    this.nav.setRoot(ViewproductsPage);
  }

  addtocart(){
    //var prodarray = new Array(prod.id,prod.title,prod.images[0].src,prod.variants[0].price, 1);

    var prodjson = '{"id":"' + this.prod.id + '","title":"' +  this.prod.title + '","image":"' + this.prod.images[0].src
    + '","price":' + this.prod.variants[0].price + ',"qty":1}';

    this.cartservice.addToCart(prodjson);

    console.log('calling addlineitems function...');
    this.addlineitems();
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

  addlineitems(){
    // this.checkoutid = this.cartservice.getcheckoutid();
    // console.log('Adding line item for ' + this.prod.id);
    console.log('Checkout id ', this.checkoutid);
    console.log('Product id in addlineitems ', this.prod.id);
    if(this.checkoutid == undefined || this.checkoutid == " "){
      this.client.checkout.create().then((checkout) => {
        this.prodcheckout = checkout;
        this.cartservice.setwebUrl(checkout.webUrl);
        this.storage.set('weburl',checkout.webUrl);
        this.cartservice.setcheckoutid(checkout.attrs.id.value);
        this.storage.set('checkoutid',checkout.attrs.id.value);
        console.log('web url = ' + checkout.webUrl);
        this.client.product.fetch(this.prod.id).then((product) => {
            var lineItemsToAdd = [
              {
                variantId: product.attrs.variants[0].id,
                quantity: 1,
                customAttributes: [{key: "prodid", value:this.prod.id}]
              }
            ];

            this.client.checkout.addLineItems(checkout.attrs.id.value, lineItemsToAdd).then((checkout) => {
              console.log('Checkout after adding lineitems first time ', checkout);
            this.navCtrl.setRoot(ViewcartPage);
          });
        });
      })
    }
    else {
      this.client.product.fetch(this.prod.id).then((product) => {
        // console.log('Product details ');
        // console.log(product);
        var lineItemsToAdd = [
          {
            variantId: product.attrs.variants[0].id,
            quantity: 1,
            customAttributes: [{key: "prodid", value: this.prod.id}]
          }
        ];

        this.client.checkout.addLineItems(this.checkoutid, lineItemsToAdd).then((checkout) => {
          // Do something with the updated checkout
          console.log('Checkout after adding lineitems not first time ', checkout);
          this.navCtrl.setRoot(ViewcartPage);
        });
      });
    }
  }
}
