import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams } from 'ionic-angular';
// import { ManagecustomersProvider } from '../providers/managecustomers/managecustomers';
import { ManagecustomersProvider } from '../../../providers/managecustomers/managecustomers';
import { Storage } from '@ionic/storage';
import {ViewcartPage} from '../../cart/viewcart/viewcart';
import {HomePage} from '../../home/home';
import {ViewproductsPage} from '../../products/viewproducts/viewproducts';
import {OrdersPage} from '../../orders/orders';
import {RegisterPage} from '../register/register';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
declare var cordova: any;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('content') nav :Nav;
  username : string;
  password: string;
  email : string;
  lastpagevisited : string;
  customers: any;
  isLogin : boolean = false;
  errormsg : string;
  customerid : string;
  emailfound : boolean = false;
  totalcustomers : number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, private managecustomers : ManagecustomersProvider,
    private storage : Storage) {

      // this.getlocalcustomers();
      // this.managecustomers.getcustomersdata().then((val : any)=> {
      //   console.log('Customer data ', val);
      // })
      // this.managecustomers.getcustomersdata();

      // this.storage.get('customerdata').then((val : any) => {
      //   console.log('Customer data in login ', val);
      // })

      this.managecustomers.getCustomers()
      .subscribe((result : any) => {

        console.log(result.customers);
        this.customers = result.customers;

        this.totalcustomers = this.customers.length;
        this.storage.set('customerdetails',this.customers);
      }, (error) => {
        console.log(error);
      });
  }


  async getlocalcustomers(){
    const url = 'https://a761ca71e70728705c351a7a54622a8d:512cd73d33fea018252f63000bdf8e5f@grocerium-exelic-poc.myshopify.com/admin/customers.json';
      const params = {};
      let authheader = "Basic YTc2MWNhNzFlNzA3Mjg3MDVjMzUxYTdhNTQ2MjJhOGQ6NTEyY2Q3M2QzM2ZlYTAxODI1MmY2MzAwMGJkZjhlNWY=";
      const headers = {
        'Content-Type': 'application/json',
        'Authorization' : authheader
      };

      console.log('url = ', url);

      //Using cordova plugins start
       cordova.plugin.http.get(url,
            params, headers, (response) => {
            this.storage.set('customerdata',JSON.parse(response.data).customers) ;
            this.customers = JSON.parse(response.data).customers;
        }, function(response) {
          console.error(response.error);
        });
        this.storage.set('customerupdate', false);
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');

  }

  login(){
    this.storage.set('customerupdate', false);
    // this.storage.get('email').then((val : string)=> {
    //   if(val != ""){
    //     this.isLogin = true;
    //     return;
    //   }
    // });

    for(let customer of this.customers){

      if(customer.email.toLowerCase() == this.email.toLowerCase() ){
        this.emailfound = true;

        this.customerid = customer.id;
        this.storage.set('customerid',this.customerid);

        if(customer.note.toLowerCase() != this.password.toLowerCase()){
          this.emailfound = false;
          this.storage.set('customerupdate', true);
          this.storage.set('error','Invalid login credentials');
          this.errormsg = "Invalid login credentials";
          return;
        }
        this.storage.set("email", this.email.toLowerCase());
        this.storage.set("password",this.password);

        this.storage.set("fname",customer.first_name);
        this.storage.set("lname",customer.last_name);

        if(customer.orders_count > 0){
          this.storage.set("address1",customer.default_address.address1);
          this.storage.set("address2",customer.default_address.address2);
          this.storage.set("city",customer.default_address.city);
          this.storage.set("country",customer.default_address.country);
          this.storage.set("phone",customer.default_address.phone);
          // console.log('Phone number in login - ', customer.default_address.phone);
          this.storage.set("province",customer.default_address.province_code);
          this.storage.set("zip",customer.default_address.zip);
        }

        // console.log(this.)
        this.storage.get('lastpagevisited').then((val : string) => {
          this.lastpagevisited = val;
          // console.log('Last Page Visited ' ,this.lastpagevisited);

          if(this.lastpagevisited == null){
            this.navCtrl.setRoot(HomePage);
            //this.nav.setRoot(ViewproductsPage);
          }
          else if(this.lastpagevisited == "orders"){
            this.navCtrl.setRoot(OrdersPage);
            // this.nav.setRoot(ViewcartPage);
          }
          else {
            this.storage.get('checkoutid').then((val : any)=> {
              if(val == undefined || val == " ") {
                this.navCtrl.setRoot(ViewproductsPage);
              }
              else {
                this.navCtrl.setRoot(ViewcartPage);
              }
            })

          }

        })
        this.errormsg = "";
      }

    }

    if(!this.emailfound) {
      this.storage.set('error','Invalid login credentials');
      this.errormsg = "Invalid login credentials";
    }

  }

  register(){
    //this.router.navigate(['/register']);
    // const browser = this.iab.create('https://mapexs.com/account/register', '_system', {location:'yes'});
    this.navCtrl.push(RegisterPage);
  }
}
