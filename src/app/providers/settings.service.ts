import { Injectable } from '@angular/core';
import { StorageService } from '../providers/storage.service';

@Injectable()
export class SettingsService {

  constructor(
    private storage: StorageService
  ) { }

  getSettings() {
    return JSON.parse( this.storage.getItem( 'settings' ) );
  }

  saveSettings( data ) {
    this.storage.setItem( 'settings', JSON.stringify( data ) );
  }

  resetSettings() {
    this.storage.removeItem( 'settings' );
  }

  getSetting( item ) {
    const set = this.getSettings();
    return set[ item ];
  }

}
