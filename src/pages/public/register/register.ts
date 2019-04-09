import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ManagecustomersProvider } from '../../../providers/managecustomers/managecustomers';
import { HomePage } from '../../home/home';
import {ViewcartPage} from '../../cart/viewcart/viewcart';
import {ViewproductsPage} from '../../products/viewproducts/viewproducts';
import {OrdersPage} from '../../orders/orders';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()

let _this;
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  firstname : string;
  lastname : string;
  email : string;
  password : string;
  loginuser : string;
  customerdetails : any;

  customerdata : any ;

  updateuser : boolean = false;

  custdata : any = {
    "id" : "",
    "note" : ""
  };

  userexistswithpwd : boolean = false;

  updatecustomerdata : any = {"customer" : this.custdata};

  allcustomersdata : any = {"customer":this.customerdata };

  customers : any;
  lastpagevisited : string;
  emailfound : boolean = false;
  errormsg : string;
  customerid : string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage : Storage, private managecustomers : ManagecustomersProvider) {
      /*this.storage.get('customerdata').then((customer : any)=> {
        this.customerdetails = customer;

        console.log('Customer data in register constructor ', this.customerdetails);
      });*/
      this.getlocalcustomers();

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    // this.storage.get("email").then((val : string) => {
    //   this.loginuser = val;
    // });
  }

  // logout() {
  //   this.storage.set("email","");
  //   this.loginuser = "";
  // }

  register() {
    // _this = this;
    this.customerdata = {
      'first_name': this.firstname,
      'last_name' : this.lastname,
      'email' : this.email,
      'phone' : null,
      'verified_email' : true,
      'addresses': [],
      'password' : this.password,
      'password_confirmation' :this.password,
      'send_email_welcome' : false,
      'note' : this.password
    } ;


    //Check email exists
    this.allcustomersdata.customer = this.customerdata;
    let emailfound : boolean = false;
    let notefound : boolean = true;
    for(let cust of this.customerdetails){
      if(cust.email.toLowerCase() == this.email.toLowerCase()){
        emailfound = true;
        console.log('Email found ', emailfound);
        if(cust.note == null){
          notefound = false;
          console.log('Note Found ', notefound);
          this.custdata.id= cust.id;
          this.custdata.note = this.password;

          this.updatecustomerdata.customer = this.custdata;

          console.log('Customer data to update ', this.updatecustomerdata);
          break;
        }

      }
    }

    if(emailfound && notefound) {
      this.userexistswithpwd = true;
      // this.navCtrl.push(HomePage);
      return;
    }

    if(emailfound && !notefound){
      this.updateuser = true;
    }



    if(this.updateuser) {
      console.log('Updating customer');
      this.updatecustomer(this.updatecustomerdata);
    }
    else {
      console.log('Registering customer');
      this.registercustomer(this.allcustomersdata);
    }

    this.userexistswithpwd = false;
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
            this.customerdetails = JSON.parse(response.data).customers;

            console.log('Customer details in getlocalcustomers ', this.customerdetails);

            if(this.email != undefined && this.email != " ") {
              this.logincustomer();
            }

        }, function(response) {
          console.error(response.error);
        });
        this.storage.set('customerupdate', false);
  }

  updatecustomer(customerdata) {
    _this = this;
    const url = 'https://a761ca71e70728705c351a7a54622a8d:512cd73d33fea018252f63000bdf8e5f@grocerium-exelic-poc.myshopify.com/admin/customers/' + this.custdata.id + '.json';
    // const params = {};
    let authheader = "Basic YTc2MWNhNzFlNzA3Mjg3MDVjMzUxYTdhNTQ2MjJhOGQ6NTEyY2Q3M2QzM2ZlYTAxODI1MmY2MzAwMGJkZjhlNWY=";
    // console.log('Customer data in register customer method ', customerdata);
    const headers = {
      'Authorization' : authheader
    };

    cordova.plugin.http.setDataSerializer( "json" );
    cordova.plugin.http.put(url, customerdata, headers, function(response) {
      try {
        // _this.getlocalcustomers();
        _this.setcustomer();

        _this.storage.get('lastpagevisited').then((val : string) => {
          if(val == 'orders') {
            _this.navCtrl.setRoot(OrdersPage);
          }
          else if(val == 'viewcart'){
            _this.navCtrl.push(ViewcartPage);
          }
          else {
            _this.navCtrl.setRoot(HomePage);
          }
        });
        }
        catch(e) {
            console.log(e);
        }
    }, function(response) {
      console.log(response);
    });
  }

  registercustomer(customerdata) {
    _this = this;
    const url = 'https://a761ca71e70728705c351a7a54622a8d:512cd73d33fea018252f63000bdf8e5f@grocerium-exelic-poc.myshopify.com/admin/customers.json';
    // const params = {};
    let authheader = "Basic YTc2MWNhNzFlNzA3Mjg3MDVjMzUxYTdhNTQ2MjJhOGQ6NTEyY2Q3M2QzM2ZlYTAxODI1MmY2MzAwMGJkZjhlNWY=";
    // console.log('Customer data in register customer method ', customerdata);
    const headers = {
      'Authorization' : authheader
    };

    cordova.plugin.http.setDataSerializer( "json" );
    cordova.plugin.http.post(url, customerdata, headers, function(response) {
      try {
        // _this.getlocalcustomers();
        _this.setcustomer();

        _this.storage.get('lastpagevisited').then((val : string) => {
          if(val == 'orders') {
            _this.navCtrl.setRoot(OrdersPage);
          }
          else if(val == 'viewcart'){
            _this.navCtrl.push(ViewcartPage);
          }
          else {
            _this.navCtrl.setRoot(HomePage);
          }
        });

        }
        catch(e) {
            console.log(e);
        }
    }, function(response) {
      console.log(response);
    });
  }


  setcustomer() {
    this.storage.set("address1", " ");
    this.storage.set("address2", " ");
    this.storage.set("city", " ");
    this.storage.set("country", " ");
    this.storage.set("fname", this.firstname);
    this.storage.set("lname", this.lastname);
    this.storage.set("phone"," ");
    this.storage.set("province"," ");
    this.storage.set("zip", " ");

    this.storage.set("email", this.email.toLowerCase());
    this.storage.set("password",this.password);

  }

  getcustomers() {
    this.managecustomers.getCustomers()
      .subscribe((result : any) => {

        console.log(result.customers);
        this.customers = result.customers;

        this.storage.set('customerdetails',this.customers);
      }, (error) => {
        console.log(error);
      });
  }

  logincustomer() {
    this.storage.set('customerupdate', false);

    for(let customer of this.customerdetails){

      console.log('Customer email ', customer.email);
      console.log('Email ' , this.email);
      if(customer.email.toLowerCase() == this.allcustomersdata.customer.email.toLowerCase() ){
        this.emailfound = true;

        this.customerid = customer.id;
        this.storage.set('customerid',this.customerid);

        console.log('Customer Note ', customer.note);
        console.log('Password ' , this.password);
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

}
