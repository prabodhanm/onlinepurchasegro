import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import {RequestOptions, Headers} from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
// import {HttpClientModule} from '@angular/common/http';
// import { HttpHeaders } from '@angular/common/http';
/*
  Generated class for the ManagecustomersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var cordova : any;
@Injectable()
export class ManagecustomersProvider {

  constructor(public http: HttpClient, private httpnative: HTTP,
    private storage : Storage) {
    console.log('Hello ManagecustomersProvider Provider');
  }

    getcustomersdata()   {
     let customerdata : any;
    try {
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
            // JSON.parse(response.data).customers;
            this.storage.set('customerdata',JSON.parse(response.data).customers) ;

        }, function(response) {
          console.error(response.error);
        });

        //cordova.plugin.http.get().

      console.log('Response with cordova plugins ' ,  customerdata );

      //Cordova plugins end

      // const response =  this.httpnative.get(url, params, headers);
      // const response =  this.http.get(url);

      // console.log(response.status);
      // console.log(JSON.parse(response.data)); // JSON data returned by server
      // console.log(response.headers);



      // const headers = new Headers({
      //   'Content-Type': 'application/json',
      //   'Authorization': token
      // });
      // const options = new RequestOptions({
      //   headers: headers
      // });
      // this.http.get(url,  {headers: headers}).subscribe(response => {
      //   console.log('Response = ' , response);
      // })

      // this.http.get(url).subscribe(response => {
      //   console.log('Response = ', response);
      // });


      // this.httpnative.get(url, params, headers).then((val: any) => {
      //   console.log('Response ', val);
      // })

      // return customerdata;
    } catch (error) {
      console.error('Error = ' ,error);
      // console.error(error.error); // Error message as string
      // console.error(error.headers);
    }
  }

  getCustomers(){
    let url = '/api';
    return this.http.get(`${url}`);


    // let url = 'https://api.binance.com/api/v1/exchangeInfo';
    // let url = 'https://a761ca71e70728705c351a7a54622a8d:512cd73d33fea018252f63000bdf8e5f@grocerium-exelic-poc.myshopify.com/admin/customers.json'
    // return this.http.get(`${url}`);


  }

  getOrdersByCustomer() {
    let url = '/orders';
    return this.http.get(`${url}`);
  }

  updatecustomer(customerdata){
    console.log('customer data in managecustomers ' , customerdata);
    let url = "/customers/" + customerdata.customer.id + ".json" ;
    const header = {
      'Content-Type': 'application/json'
      };
    return this.http.put(url , customerdata, {headers:header});
  }

  getorders(loginuser) : any {
    let orders : any;
    let orderitem : any = {};
    let filterorders : any = [];
    const url = 'https://a761ca71e70728705c351a7a54622a8d:512cd73d33fea018252f63000bdf8e5f@grocerium-exelic-poc.myshopify.com/admin/orders.json';
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
              console.log('Orders in getorders ', JSON.parse(response.data).orders);
              orders = JSON.parse(response.data).orders;
              filterorders = [];
              for(let order of orders){
                console.log('orderitem from orders ' , order);
                console.log('Order user ', order.email);
                console.log('current user ', loginuser);
                if(order.email == loginuser){

                  orderitem =
                  {
                    "orderno": order.name,
                    "date" : order.created_at.substring(0,10),
                    "customer" : order.billing_address.name,
                    "paymentstatus" : order.financial_status,
                    "total" : order.total_price
                  };

                  filterorders.push(orderitem);
                  orderitem = {};
                }
              }
              console.log('Filter orders ', orders);
        }, function(response) {
          console.error(response.error);
        });
        this.storage.set('customerupdate', false);
        return filterorders;
  }
  registercustomer(customerdata){
    const url = 'https://a761ca71e70728705c351a7a54622a8d:512cd73d33fea018252f63000bdf8e5f@grocerium-exelic-poc.myshopify.com/admin/customers.json';
    // const params = {};
    let authheader = "Basic YTc2MWNhNzFlNzA3Mjg3MDVjMzUxYTdhNTQ2MjJhOGQ6NTEyY2Q3M2QzM2ZlYTAxODI1MmY2MzAwMGJkZjhlNWY=";
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
        }
        catch(e) {
            console.error("JSON parsing error");
        }
    }, function(response) {
      console.log(response.status);
    });


    // console.log('customer data in managecustomers ' , customerdata);
    // let url = '/customer';
    // const header = {
    //   'Content-Type': 'application/json'
    //   };

    // return this.http.post(url,customerdata, {headers:header});

    /*const httpOptions = new HttpHeaders(header);

    var options =  {
      method: 'POST',
      body: customerdata,
      headers: {
          'Content-Type': 'application/json'
        }
    };*/
    // {headers : httpOptions}

    // return this.http.post(url,customerdata, {headers:header});
    // return this.http.post(url,options);
  }
}
