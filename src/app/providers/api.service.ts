import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from 'config';
import { SettingsService } from './settings.service';

@Injectable()
export class ApiService {

  settings: object = {};
  noCache = '?no_cache=' + Math.random();

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.settings = this.settingsService.getSettings();
  }

  getCoins() {
    return this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ][ 'ticker' ] + this.noCache + '&limit=9999' );
  }

  getCoin( id ) {
    return this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ][ 'ticker' ] + id + '/' + this.noCache );
  }

  getChart( id, diffTime ) {
    return this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ][ 'chart' ] + id + '/' + diffTime[ 'start' ] + '/' + diffTime[ 'end' ] + '/' + this.noCache );
  }

}
