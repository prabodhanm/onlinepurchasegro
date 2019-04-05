import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { ManagecustomersProvider } from '../../../providers/managecustomers/managecustomers';
import { HomePage } from '../../home/home';
import { Storage } from '@ionic/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage : Storage) {
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

    this.allcustomersdata.customer = this.customerdata;
    //Check email exists

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
      return;
    }

    if(emailfound && !notefound){
      this.updateuser = true;
    }



    if(this.updateuser) {
      this.updatecustomer(this.updatecustomerdata);
    }
    else {
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
        _this.navCtrl.push(HomePage);
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
        _this.navCtrl.push(HomePage);
        }
        catch(e) {
            console.log(e);
        }
    }, function(response) {
      console.log(response);
    });
  }
}
