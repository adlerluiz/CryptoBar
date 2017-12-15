import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../providers/settings.service';
import { ApiService } from '../../providers/api.service';
import { HttpClient } from '@angular/common/http';
import { CompleterService, CompleterData } from 'ng2-completer';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings: any = {};
  coins: any = [];
  exchanges: any = [];
  modalInputCoin = '';
  modalExchange = {};
  package: any = {
	  version: '1'
  };

  //dataService: CompleterData;

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient,
    private apiService: ApiService,
    private completerService: CompleterService
  ) {

    this.apiService.getCoins().subscribe( data => {
      //this.dataService = completerService.local( data, 'name,symbol', 'symbol' );
    } );
  }

  ngOnInit() {
    this.settings = this.settingsService.getSettings();
    this.http.get('./package.json').subscribe( data => this.package = data );

    this.coins = this.settings[ 'COINS' ];
    this.exchanges = this.settings[ 'EXCHANGES' ];
  }

  close() {
    window.close();
  }

  addCoin() {
    if ( this.modalInputCoin ) {
      this.coins.push( this.modalInputCoin );
    }

    this.modalInputCoin = '';
  }

  removeCoin( index ) {
    this.coins.splice( index, 1 );
  }

  addExchange() {
    if ( this.modalExchange ) {
      this.exchanges.push( this.modalExchange );
    }

    this.modalExchange = {};
  }

  removeExchange( index ) {
    this.exchanges.splice( index, 1 );
  }

  save() {
    this.settingsService.saveSettings( this.settings );
    this.restart();
  }

  reset() {
    this.settingsService.resetSettings();
    this.restart();
  }

  restart() {
    require('electron').remote.app.relaunch();
    require('electron').remote.app.quit();
  }

}
