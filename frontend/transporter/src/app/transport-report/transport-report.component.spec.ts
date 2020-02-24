import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportReportComponent } from './transport-report.component';

describe('TransportReportComponent', () => {
  let component: TransportReportComponent;
  let fixture: ComponentFixture<TransportReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
