import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombosVendidosComponent } from './combos-vendidos.component';

describe('CombosVendidosComponent', () => {
  let component: CombosVendidosComponent;
  let fixture: ComponentFixture<CombosVendidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombosVendidosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CombosVendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
