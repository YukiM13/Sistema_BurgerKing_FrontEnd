import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: SucursalCreateComponent;
  let fixture: ComponentFixture<SucursalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucursalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
