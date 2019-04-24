import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage} from '../home/home';
/**
 * Generated class for the InvalidsearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-invalidsearch',
  templateUrl: 'invalidsearch.html',
})
export class InvalidsearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvalidsearchPage');
  }

  goback() {
    this.navCtrl.setRoot(HomePage);
  }

}
