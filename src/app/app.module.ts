import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';
import { StorageService } from './providers/storage.service';
import { SettingsService } from './providers/settings.service';
import { ApiService } from './providers/api.service';
import { MessageService } from './providers/message.service';

import { HttpClientModule } from '@angular/common/http';
import { CoinInfoComponent } from './components/coin-info/coin-info.component';
import { SettingsComponent } from './components/settings/settings.component';

import { Ng2CompleterModule } from 'ng2-completer';
import {SortablejsModule} from 'angular-sortablejs';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CoinInfoComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule,
    Ng2CompleterModule,
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  providers: [ElectronService, StorageService, SettingsService, ApiService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
