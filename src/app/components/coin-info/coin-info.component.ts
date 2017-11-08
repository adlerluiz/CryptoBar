import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from 'config';
import { SettingsService } from '../../providers/settings.service';

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

  loadCurrency(id) {
    this.http.get( API_URLS[ this.settings[ 'API_SELECTED' ] ] + id + '/?no_cache=' + Math.random() ).subscribe( data => {
      this.coin = data[ 0 ];
    });
  }

  close() {
    window.close();
  }

}
