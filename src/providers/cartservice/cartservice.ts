import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CartserviceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartserviceProvider {

  _cart = [];
  _newcart = [];
  _checkoutid : string;
  _weburl : string;
  _prod : any;

  constructor(public http: HttpClient) {
    console.log('Hello CartserviceProvider Provider');
  }

  addToCart(item) {

    let jsonitem : any;

    //alert(index);
    let counter : number = -1;
    let curpos : number = -1;
    for(let d of this._cart){
      curpos += 1;
      /*alert('d =' + d.id);
      alert('item =' + JSON.parse(item).id);*/
      if(d.id === JSON.parse(item).id){
        //alert('Found at  position ' + curpos);
        jsonitem = JSON.parse(item);
        jsonitem.qty = Number(jsonitem.qty ) + 1;
        jsonitem.price = Number(jsonitem.price ) * Number(jsonitem.qty );
        //alert(jsonitem.qty);
        this._cart.splice(curpos,1);
        this._cart.push(jsonitem);
        counter += 1;
        break;
      }
    }

    if(counter == -1){
      this._cart.push(JSON.parse(item));
    }

  }

  getcart(){
    return this._cart;
  }

  setcart(cart){
    this._cart = cart;
  }

  getcheckoutid(){
    return this._checkoutid;
  }

  setcheckoutid(id){
    this._checkoutid = id;
  }

  setwebUrl(url){
    this._weburl = url;
  }

  getwebUrl(){
    return this._weburl;
  }


  setproduct(prod){
    this._prod = prod;
  }

  getproduct(){
    return this._prod;
  }

  removeFromCart(item){

    // let counter: number = 0;
    /*alert(item);
    alert(this._cart);*/
    var index = this._cart.indexOf(item);
    // alert(index);
    // alert('Index found at ' + index);
    this._cart.splice(index,1);
  }

  clearCart(){
    this._cart = [];
  }
}
