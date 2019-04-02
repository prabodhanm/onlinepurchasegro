import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  public globalimages : any = ['NM1.jpg','alphanso-mango500x500.jpg',
  'garden.jpg','IMG_5057.jpg','mango-323945_960_720.jpg','mango-361906_960_720.jpg'];

  constructor(public http: HttpClient) {
    console.log('Hello GlobalProvider Provider');
  }

}
