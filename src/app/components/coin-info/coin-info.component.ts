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
  defaultTimeChart = {
    name: '1w',
    value: 24 * 7
  };

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
    const diffTime = this.getDiffTime( this.defaultTimeChart[ 'value' ] );
    this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ][ 'chart' ] + id + '/' + diffTime[ 'start' ] + '/' + diffTime[ 'end' ] + '/?no_cache=' + Math.random() )
      .subscribe( data => {
        this.fetchChartData( data );
      } );
  }

  fetchChartData( dataToFetch ) {
    const auxPriceUsd = [];

    dataToFetch['price_usd'].forEach( data => {
      auxPriceUsd.push( { x: new Date(data[ 0 ]), y: data[ 1 ] } );
    } );

    this.renderizeChart( auxPriceUsd );
  }

  changeChartData( name, value ) {
    this.defaultTimeChart[ 'name' ] = name;
    this.defaultTimeChart[ 'value' ] = value;
    this.loadChart( this.coin[ 'id' ] );
  }

  getDiffTime( hours ) {
    const diffTime = ( 1000 * 60 * 60 * hours );
    const now = new Date();
    const secs = now.getTime();

    return { start: secs - diffTime, end: secs };
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
