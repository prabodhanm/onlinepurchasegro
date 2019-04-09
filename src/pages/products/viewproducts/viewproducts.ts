import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ManageproductsProvider } from '../../../providers/manageproducts/manageproducts';
import { CartserviceProvider } from '../../../providers/cartservice/cartservice';
import { ViewcartPage } from '../../cart/viewcart/viewcart'
import { DetailcartPage } from '../../cart/detailcart/detailcart';
import { Storage } from '@ionic/storage';
import Client from 'shopify-buy';
import { OrdersPage } from '../../orders/orders';
import {EmptycartPage} from '../../cart/emptycart/emptycart';
/**
 * Generated class for the ViewproductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-viewproducts',
  templateUrl: 'viewproducts.html',
})
export class ViewproductsPage {

  cart = [];
  products : any;
  checkoutid : string;
  client : any;
  prodcheckout : any;
  loginuser : string;
  filterproducts : any = [];
  prodsearch : string;
  baseproducts : any = [];
  // lastpagevisited : string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private manageproducts : ManageproductsProvider,
    private storage : Storage, private cartservice : CartserviceProvider) {
      this.client = Client.buildClient({
        domain: 'grocerium-exelic-poc.myshopify.com',
        storefrontAccessToken: '5078ba324691cf957494dc2d661b8288'
        // appId: '6'
      });


      this.storage.get("email").then((val : string) => {
        this.loginuser = val;
        console.log('login user in view products constructor ', this.loginuser);
        this.storage.get('checkoutid').then((val : any)=> {
          console.log('Checkout id in viewproducts constructor ', val);
          console.log('Cart length ', this.cart.length);
          if(val == undefined || val == " "){
            this.cart = [];
            this.cartservice.setcart(this.cart);
          }
          else {
            this.storage.get('cart').then((val : any) => {
              console.log('Cart value ', val);
              if(val != null) {
                this.cart = val;
              }
              else {
                this.cart = [];
              }
              this.cartservice.setcart(this.cart);
            })
          }
        })
      });
  }

  ionViewDidLoad() {

    this.storage.get('prodcategory').then((val:any)=> {
      this.prodsearch = val;

      if(this.prodsearch == "atta"){
        this.prodsearch = "chakki-fresh-atta";
      }
      //Fetch collections
      this.client.collection.fetchAllWithProducts().then((collections) => {
        this.prodsearch = this.prodsearch.toLowerCase();
        let re = / /gi;
        // console.log(this.prodsearch.replace(re,'-'));
        for(let collection of collections){
          // console.log(collection.handle);
          if(this.prodsearch.replace(re,'-') == collection.handle.toLowerCase()) {
            this.products = collection.products;
            break;
          }
        }
      });
    })

    // this.storage.set('checkoutid', " ");

   /* this.storage.get('products').then((prods: any)=> {
      if(prods.length > 0){
        this.products = prods;
        console.log('products received from home page in product view details load ', this.products);
      }
      else {
        this.storage.get('prodcategory').then((val:any)=> {
          this.prodsearch = val;

          if(this.prodsearch == "atta"){
            this.prodsearch = "chakki-fresh-atta";
          }
          //Fetch collections
          this.client.collection.fetchAllWithProducts().then((collections) => {
            this.prodsearch = this.prodsearch.toLowerCase();
            let re = / /gi;
            // console.log(this.prodsearch.replace(re,'-'));
            for(let collection of collections){
              // console.log(collection.handle);
              if(this.prodsearch.replace(re,'-') == collection.handle.toLowerCase()) {
                this.products = collection.products;
                break;
              }
            }
          });
        })
      }
    });*/


  }

  ionViewWillEnter() {
    this.storage.get('checkoutid').then((val:any) => {
      if(val == undefined || val == " "){
        this.cartservice.setcart([]);
      }
    });
    this.cart = this.cartservice.getcart();
  }


  filterbaseproducts() {
    if(this.prodsearch.toLowerCase() == "chakki fresh atta"){
      this.prodsearch = "atta";
    }
    // console.log('Product to search in viewproducts ', this.prodsearch.toLowerCase());
    for(let baseprod of this.baseproducts){
      if(baseprod.tags.toLowerCase() == this.prodsearch.toLowerCase()){
        for(let prod of this.products){
          if(baseprod.title == prod.title){
            this.filterproducts.push(prod);
          }
        }
      }
    }
  }
  getadminproducts() {

    this.manageproducts.getAdminProducts().subscribe((result : any) => {
      // console.log('Admin products in viewproducts ', result);
      //this.products = result.products;

      this.storage.get('prodcategory').then((val : string)=> {
        if(val === "Chakki Fresh Atta"){
          val = "atta";
        }
        else {
          val = val.toLowerCase();
        }
        for(let p of result.products){
           if(p.tags == val){
             this.filterproducts.push(p);
           }
        }
      });

      // console.log('Filter products ' , this.filterproducts);

    }, (error)=> {
      console.log('Error occurred ', error.error);
    });
  }

  showorders() {
    this.navCtrl.push(OrdersPage);
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
  viewcart(){
    // console.log('You click the image');
    this.cart = this.cartservice.getcart();
    // this.router.navigateByUrl('viewmycart');
    if(this.cart.length > 0){
      this.navCtrl.push(ViewcartPage);
    }
    else {
      this.navCtrl.push(EmptycartPage);
    }

  }

  showdetailitems(prod){
    this.cartservice.setproduct(prod);
    this.storage.set('prodid', prod.id);
    this.navCtrl.push(DetailcartPage);
  }

  async addtocart(prod){
    var prodjson = '{"id":"' + prod.id
    + '","title":"' +  prod.title
    + '","image":"' + prod.images[0].src
    + '","price":' + prod.variants[0].price
    + ',"qty":1'
    // + ',"lineitemsid":"' +  checkout.lineItems[checkout.lineItems.length-1].id
    +  '}';
    // console.log('prod json = ' + prodjson);
    this.cartservice.addToCart(prodjson);

    // console.log('Added to cart in viewproducts...');
    this.addlineitems(prod);
  }

   addlineitems(prod) {
    //this.checkoutid = this.cartservice.getcheckoutid();
    let prodid : any;
    // console.log('Adding line item for ' + prod.id);
    prodid = prod.id;
    this.storage.get('checkoutid')
    .then((val) => {
      this.checkoutid = val;
      // console.log('Checkout id in addlineitems:' , this.checkoutid);


      if(this.checkoutid == undefined || this.checkoutid == " "){

        // console.log('i am in if part of addlineitems...' , this.checkoutid);
        this.client.checkout.create().then((checkout) => {
          this.prodcheckout = checkout;
          this.cartservice.setwebUrl(checkout.webUrl);
          this.cartservice.setcheckoutid(checkout.attrs.id.value);
          this.storage.set('checkoutid',checkout.attrs.id.value);
          console.log('Checkout id in viewproducts for detailscart ', checkout.attrs.id.value);
          this.storage.set('weburl',checkout.webUrl);
          // console.log('web url = ' + checkout.webUrl);
          this.client.product.fetch(prod.id).then((product) => {
            // console.log('Product details ');
            // console.log(product);
            var lineItemsToAdd = [
              {
                variantId: product.attrs.variants[0].id,
                quantity: 1,
                customAttributes: [{key: "prodid", value: prod.id}]
              }
            ];


            // console.log('Line items details');
            // console.log(lineItemsToAdd);

             this.client.checkout.addLineItems(checkout.attrs.id.value, lineItemsToAdd).then((checkout) => {
              // console.log(checkout.lineItems);
            });
          });
        })
      }
      else {

        // console.log('I am in addtocart else part...');
        // console.log('product id in view products is ', prod.id);
        // console.log('Yes it is blank...');
        this.client.product.fetch(prodid).then((product :any) => {
          // console.log('Product details in add to cart else part ', product);
          // console.log(product);
          var lineItemsToAdd = [
            {
              variantId: product.attrs.variants[0].id,
              quantity: 1,
              customAttributes: [{key: "prodid", value: prod.id}]
            }
          ];

          // console.log('Line items details');
          // console.log(lineItemsToAdd);

          this.client.checkout.addLineItems(this.checkoutid, lineItemsToAdd).then((checkout) => {
            // console.log(checkout.lineItems);
          });
        },(error)=> {
          console.log(error);
        });
      }
    });



  }
}
