import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../providers/settings.service';
import { ApiService } from '../../providers/api.service';

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
    private settingsService: SettingsService,
    private apiService: ApiService
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
    this.apiService.getCoins()
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
    return data[ this.settings[ 'PERCENT_CHANGE' ] ];
  }

  viewCoin( coin ) {
    window.open(
      '#/coin/' + coin[ 'id' ],
      'coin' + coin[ 'id' ],
      'resizable=false,' +
      'x=center,' +
      'y=center,' +
      'width=340,' +
      'height=440,' +
      'maxWidth=341,' +
      'maxHeight=441,' +
      'minWidth=341,' +
      'minHeight=441,' +
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
