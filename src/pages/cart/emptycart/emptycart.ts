import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {ViewproductsPage} from '../../products/viewproducts/viewproducts';
/**
 * Generated class for the EmptycartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-emptycart',
  templateUrl: 'emptycart.html',
})
export class EmptycartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmptycartPage');
  }

  continue() {
    this.navCtrl.setRoot(ViewproductsPage);
  }
}
