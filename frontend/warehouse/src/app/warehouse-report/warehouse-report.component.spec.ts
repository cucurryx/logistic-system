import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseReportComponent } from './warehouse-report.component';

describe('WarehouseReportComponent', () => {
  let component: WarehouseReportComponent;
  let fixture: ComponentFixture<WarehouseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
