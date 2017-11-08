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
    this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ] + '?no_cache=' + Math.random() )
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

  viewCoin( coin ) {
    window.open(
      '#/coin/' + coin.id,
      'coin',
      'resizable=false,' +
      'x=center,' +
      'y=center,' +
      'width=300,' +
      'height=280,' +
      'maxWidth=301,' +
      'maxHeight=281,' +
      'minWidth=301,' +
      'minHeight=281,' +
      'skipTaskbar=false'
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
      'maximizable=true'
    );
  }

}
