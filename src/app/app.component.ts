import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { SettingsService } from './providers/settings.service';
import { DEFAULT_SETTINGS } from 'config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private settingsService: SettingsService
  ) {

    this.verifyIsFirstTime();

    if (electronService.isElectron()) {
      console.log('Mode electron');
      // Check if electron is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.ipcRenderer);
      // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  openSettings() {
    window.open(
      '#/settings',
      'settings',
      'resizable=false,' +
      'x=center,' +
      'y=center,' +
      'width=400,' +
      'height=570,' +
      'skipTaskbar=false'
    );
  }

  verifyIsFirstTime() {
    if ( this.settingsService.getSettings() === null ) {
      this.settingsService.saveSettings( DEFAULT_SETTINGS );
      //this.openSettings()
    }
  }
}
