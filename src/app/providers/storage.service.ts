import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  getItem( item ) {
    return localStorage.getItem( item );
  }

  setItem( item, data ) {
    localStorage.setItem( item, data );
  }

  removeItem( item ) {
    localStorage.removeItem( item );
  }

}
