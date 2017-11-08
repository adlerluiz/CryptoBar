import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinInfoComponent } from './coin-info.component';

describe('CoinInfoComponent', () => {
  let component: CoinInfoComponent;
  let fixture: ComponentFixture<CoinInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
