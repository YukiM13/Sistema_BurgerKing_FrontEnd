import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsCiEditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EsCiEditComponent;
  let fixture: ComponentFixture<EsCiEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsCiEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsCiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
