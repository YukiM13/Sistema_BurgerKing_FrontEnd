import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleEditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EmpleEditComponent;
  let fixture: ComponentFixture<EmpleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
