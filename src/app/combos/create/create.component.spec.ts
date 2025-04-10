import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombosCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CombosCreateComponent;
  let fixture: ComponentFixture<CombosCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombosCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CombosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
