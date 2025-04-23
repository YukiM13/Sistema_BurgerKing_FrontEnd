import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalVentasyProductosComponent } from './total-ventasy-productos.component';

describe('TotalVentasyProductosComponent', () => {
  let component: TotalVentasyProductosComponent;
  let fixture: ComponentFixture<TotalVentasyProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalVentasyProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalVentasyProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
