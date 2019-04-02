import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Client from 'shopify-buy'
// import { Observable} from 'rxjs/Observable';
/*
  Generated class for the ManageproductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ManageproductsProvider {

  client : any;
  constructor(public http: HttpClient) {
    console.log('Hello ManageproductsProvider Provider');
    this.client = Client.buildClient({
      domain: 'grocerium-exelic-poc.myshopify.com',
      storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
      //storefrontAcShopifyBuy48edad93e001ea46c25'
    });
  }

  getproducts()  {
    console.log('inside manageproductservice...getproduct() function');
    console.log(this.client);
    return this.client.product.fetchAll()
    .then(products  => {
      console.log('Displaying products');
      console.log(products);
      return products;
    });
  }

  getAdminProducts() {
    let url = '/products';
    return this.http.get(`${url}`);
  }

}
