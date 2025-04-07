import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamaCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: TamaCreateComponent;
  let fixture: ComponentFixture<TamaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TamaCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TamaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
