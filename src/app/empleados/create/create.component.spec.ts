import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: EmpleCreateComponent;
  let fixture: ComponentFixture<EmpleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
