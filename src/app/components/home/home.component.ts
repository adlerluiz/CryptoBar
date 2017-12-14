import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from 'config';
import { SettingsService } from '../../providers/settings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  settings: object = {};
  results: any = [];
  exchanges: any = [];

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.settings = this.settingsService.getSettings();
    this.loadCoins();
    this.loadExchanges();
  }

  ngOnInit() {
    setInterval( () => {
      this.loadCoins();
    }, 1000 * this.settings[ 'TIMEOUT' ] );
  }

  loadCoins() {
    this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ][ 'ticker' ] + '?no_cache=' + Math.random() )
    .subscribe( data => {
      this.fetchData( data );
    } );
  }

  loadExchanges() {
    this.exchanges = this.settings[ 'EXCHANGES' ];
  }

  fetchData( data: any ) {
    const aux = [];

    this.settings[ 'COINS' ].forEach( ic => {
      data.forEach( item => {
        if ( ic.toUpperCase() === item.symbol ) {
          aux.push( item );
        }
      })
    });

    this.results = aux;
  }

  getPercentChangeArrow( data ) {
    return data[ this.settings['PERCENT_CHANGE'] ];
  }

  viewCoin( coin ) {
    window.open(
      '#/coin/' + coin[ 'id' ],
      'coin' + coin[ 'id' ],
      'resizable=false,' +
      'x=center,' +
      'y=center,' +
      'width=340,' +
      'height=450,' +
      'maxWidth=341,' +
      'maxHeight=451,' +
      'minWidth=341,' +
      'minHeight=451,' +
      'skipTaskbar=false,' +
      'alwaysOnTop=false'
    );
  }

  viewExchange( exchange ) {
    window.open(
      exchange[ 'url' ],
      exchange[ 'name' ],
      'resizable=true,' +
      'x=center,' +
      'y=center,' +
      'width=1400,' +
      'height=900,' +
      'skipTaskbar=false,' +
      'frame=true,' +
      'menu=false,' +
      'maximizable=true,' +
      'alwaysOnTop=false'
    );
  }

}
