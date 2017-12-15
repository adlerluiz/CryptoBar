import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../providers/settings.service';
import { ApiService } from '../../providers/api.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-coin-info',
  templateUrl: './coin-info.component.html',
  styleUrls: ['./coin-info.component.scss']
})
export class CoinInfoComponent implements OnInit {

  settings: object = {};
  coin: any = [];
  chart: any;
  private sub: any;
  defaultTimeChart: number = 24 * 7;
  loadingChart = true;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private apiService: ApiService
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
    this.apiService.getCoin( id ).subscribe( data => {
      this.coin = data[ 0 ];
      this.loadChart( this.coin[ 'id' ] );
    });
  }

  loadChart( id ) {
    this.loadingChart = true;
    const diffTime = this.getDiffTime( this.defaultTimeChart );

    this.apiService.getChart( id, diffTime ).subscribe( data => {
        this.fetchChartData( data );
    } );
  }

  fetchChartData( dataToFetch ) {
    const auxPriceUsd = [];
    const auxPriceBtc = [];

    dataToFetch[ 'price_usd' ].forEach( data => {
      auxPriceUsd.push( { x: new Date( data[ 0 ] ), y: data[ 1 ] } );
    } );

    dataToFetch[ 'price_btc' ].forEach( data => {
      auxPriceBtc.push( { x: new Date( data[ 0 ] ), y: data[ 1 ] } );
    } );

    this.renderizeChart( auxPriceUsd, auxPriceBtc );
  }

  changeChartTime( value ) {
    this.defaultTimeChart = value;
    this.chart.destroy();
    this.loadChart( this.coin[ 'id' ] );
  }

  getDiffTime( hours ) {
    const diffTime = ( 1000 * 60 * 60 * hours );
    const now = new Date();
    const secs = now.getTime();

    return { start: secs - diffTime, end: secs };
  }

  renderizeChart( auxPriceUsd, auxPriceBtc ) {
    const ctx = document.getElementById('chart');
    this.chart = new Chart(ctx, {
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
          },
          {
            label: 'BTC',
            backgroundColor: 'rgb(100, 199, 132)',
            borderColor: 'rgb(100, 199, 132)',
            data: auxPriceBtc,
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

    this.loadingChart = false;

  }

  close() {
    window.close();
  }

}
