import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../providers/settings.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings: object = {};
  coins: any = [];
  exchanges: any = [];
  modalInputCoin = '';
  modalExchange = {};
  package = {};

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.settings = this.settingsService.getSettings();

    this.coins = this.settings[ 'COINS' ];
    this.exchanges = this.settings[ 'EXCHANGES' ];

    this.http.get('./package.json')
      .subscribe(data => this.package = data);
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
