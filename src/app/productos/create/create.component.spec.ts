import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: ProduCreateComponent;
  let fixture: ComponentFixture<ProduCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProduCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
