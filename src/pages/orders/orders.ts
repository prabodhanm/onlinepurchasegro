import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ManagecustomersProvider } from '../../providers/managecustomers/managecustomers';
import { Storage } from '@ionic/storage';
import Client from 'shopify-buy';
import { HTTP } from '@ionic-native/http/ngx';
import { ChangeDetectorRef } from '@angular/core'
// import { filter } from 'rxjs/operators';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  client : any;
  orders : any;
  loginuser : string;

  filterorders : any = [] ;

  orderitem = {};
  // finalorders : any = [];

  isordersplaced : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private managecustomers : ManagecustomersProvider, private storage : Storage,
    private http: HTTP, private changeRef: ChangeDetectorRef) {
    this.client = Client.buildClient({
      domain: 'grocerium-exelic-poc.myshopify.com',
      storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
    });
    this.storage.set("lastpagevisited","orders");

    this.storage.get("email").then((val : string) => {
      console.log('login user in ionViewDidLoad ', val);
      this.loginuser = val;
    });

    console.log('Get orders in constructor');

  }


    async getorders()  {
      const url = 'https://a761ca71e70728705c351a7a54622a8d:512cd73d33fea018252f63000bdf8e5f@grocerium-exelic-poc.myshopify.com/admin/orders.json';
      const params = {};
      let authheader = "Basic YTc2MWNhNzFlNzA3Mjg3MDVjMzUxYTdhNTQ2MjJhOGQ6NTEyY2Q3M2QzM2ZlYTAxODI1MmY2MzAwMGJkZjhlNWY=";
      const headers = {
        'Content-Type': 'application/json',
        'Authorization' : authheader
      };

      console.log('url = ', url);

      const options = {
        method:'get',
        data: {},
        headers: { Authorization: authheader }
      }

      this.getordersdata(url,params,headers);
  }

  getordersdata(url,params, headers) {
    let currentorders : any = [];
    cordova.plugin.http.get(url,
      params,headers, (response) => {
          console.log('Orders in getorders ', JSON.parse(response.data).orders);
          this.orders = JSON.parse(response.data).orders;
          //this.filterorders = [];
          currentorders = [];
          for(let order of this.orders){
            console.log('orderitem from orders ' , order);
            console.log('Order user ', order.email);
            console.log('current user ', this.loginuser);
            if(order.email == this.loginuser){

              this.orderitem =
              {
                "orderno": order.name,
                "date" : order.created_at.substring(0,10),
                "customer" : order.billing_address.name,
                "paymentstatus" : order.financial_status,
                "total" : order.total_price
              };

              this.filterorders.push(this.orderitem);
              // currentorders.push(this.orderitem);
              this.orderitem = {};
            }
          }

          this.changeRef.detectChanges();

    }, function(response) {
      console.error(response.error);
    });
  }

  ionViewWillEnter() {
    console.log('Get orders in ionViewWillEnter');
    // this.getorders();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
    this.storage.set("currenpage","orders");

    console.log('Get orders in ionViewDidLoad');

    this.getorders();

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
}
