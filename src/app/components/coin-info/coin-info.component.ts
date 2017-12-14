import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from 'config';
import { SettingsService } from '../../providers/settings.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-coin-info',
  templateUrl: './coin-info.component.html',
  styleUrls: ['./coin-info.component.scss']
})
export class CoinInfoComponent implements OnInit {

  settings: object = {};
  coin: any = [];
  private sub: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {
    this.settings = this.settingsService.getSettings();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe( params => {
      this.loadCurrency( params[ 'id' ] );

      setInterval( () => {
        this.loadCurrency( params[ 'id' ] );
      }, 1000 * this.settings[ 'TIMEOUT' ] );
    });
  }

  loadCurrency( id ) {
    this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ][ 'ticker' ] + id + '/?no_cache=' + Math.random() )
      .subscribe( data => {
      this.coin = data[ 0 ];
      this.loadChart( this.coin[ 'id' ] );
    });
  }

  loadChart( id ) {
    this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ][ 'chart' ] + id + '/?no_cache=' + Math.random() )
      .subscribe( data => {
        this.fetchChartData( data );
      } );
  }

  fetchChartData( dataToFetch ) {
    const auxPriceBtc = [];
    const auxPriceUsd = [];

    /*dataToFetch['price_btc'].forEach( data => {
      auxPriceBtc.push( { x: new Date(data[ 0 ]), y: data[ 1 ] } );
    } );*/

    dataToFetch['price_usd'].forEach( data => {
      auxPriceUsd.push( { x: new Date(data[ 0 ]), y: data[ 1 ] } );
    } );

    this.renderizeChart( auxPriceUsd );
  }

  renderizeChart( auxPriceUsd ) {

    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'USD',
            backgroundColor: 'rgb(0, 99, 132)',
            borderColor: 'rgb(0, 99, 132)',
            data: auxPriceUsd,
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth: 1
          }
        ]
      },
      options: {
        animation: {
          duration: 1,
        },
        hover: {
          animationDuration: 0,
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              distribution: 'series',
              ticks: {
                source: 'labels'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

  }

  close() {
    window.close();
  }

}
