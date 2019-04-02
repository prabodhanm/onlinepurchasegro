import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ManagecustomersProvider } from '../../../providers/managecustomers/managecustomers';
import { HomePage } from '../../home/home';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
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

  customerdata : any = {
    "first_name": "",
    "last_name" : "",
    "email" : "",
    "phone" : "",
    "verified_email" : true,
    "addresses": [],
    "password" : "",
    "password_confirmation":"",
    "send_email_welcome" : false,
    "note" : ""
  } ;

  custdata : any = {
    "id" : "",
    "note" : ""
  };

  updatecustomerdata : any = {"customer" : this.custdata};

  allcustomersdata : any = {"customer":this.customerdata };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private managecustomer : ManagecustomersProvider, private storage : Storage) {
      this.storage.get('customerdata').then((customer : any)=> {
        this.customerdetails = customer;

        console.log('Customer data in register constructor ', this.customerdetails);
      });
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
    this.customerdata.first_name = this.firstname;
    this.customerdata.last_name = this.lastname;
    this.customerdata.email = this.email;
    this.customerdata.password = this.password;
    this.customerdata.password_confirmation = this.password;
    this.customerdata.note = this.password;


    //Check email exists

    for(let cust of this.customerdetails){
      if(cust.email == this.email){
        this.custdata.id= cust.id;
        this.custdata.note = this.password;
        // this.custdata.password_confirmation = this.password;
      }
    }


    this.storage.get('customerupdate').then((val : boolean) => {
      console.log('value of val in register ', val);

      if(val) {
        this.managecustomer.updatecustomer(this.updatecustomerdata).subscribe((customer) => {
          this.navCtrl.push(HomePage);
        }, (error) => {
          console.log(error);
        });
      }
      else {
        this.registercustomer(this.allcustomersdata);
      }
    })
  }


  registercustomer(customerdata) {
    const url = 'https://a761ca71e70728705c351a7a54622a8d:512cd73d33fea018252f63000bdf8e5f@grocerium-exelic-poc.myshopify.com/admin/customers.json';
    // const params = {};
    let authheader = "Basic YTc2MWNhNzFlNzA3Mjg3MDVjMzUxYTdhNTQ2MjJhOGQ6NTEyY2Q3M2QzM2ZlYTAxODI1MmY2MzAwMGJkZjhlNWY=";
    console.log('Customer data in register customer method ', customerdata);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization' : authheader
    };

    cordova.plugin.http.post(url,customerdata,headers, function(response) {
      console.log('Response from customer post ' ,response);
      try {
        response.data = JSON.parse(response.data);
        // prints test
        console.log(response.data.message);
        this.navCtrl.push(HomePage);
        }
        catch(e) {
            console.error("JSON parsing error");
        }
    }, function(response) {
      console.log(response);
    });
  }
}
