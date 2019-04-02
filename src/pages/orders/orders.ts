import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ManagecustomersProvider } from '../../providers/managecustomers/managecustomers';
import { Storage } from '@ionic/storage';
import Client from 'shopify-buy';
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

  filterorders : any = [];

  orderitem = {};

  isordersplaced : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private managecustomers : ManagecustomersProvider, private storage : Storage) {
    this.client = Client.buildClient({
      domain: 'grocerium-exelic-poc.myshopify.com',
      storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
    });
    this.storage.set("lastpagevisited","orders");
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
    this.storage.set("currenpage","orders");
   // this.filterorders.push(ite)
    this.storage.get("email").then((val : string) => {
      this.loginuser = val;
    });

    this.managecustomers.getOrdersByCustomer()
    .subscribe((orders : any) => {
      this.orders = orders.orders;
      console.log('Orders placed ', this.orders);
      for(let order of this.orders){
        console.log('orderitem from orders ' , order);
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
          this.orderitem = {};
        }
      }

      if(this.filterorders.length == 0){
        this.isordersplaced = false;
      }
      else {
        this.isordersplaced = true;
      }



      console.log('Filter orders ', this.filterorders);
    })
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
