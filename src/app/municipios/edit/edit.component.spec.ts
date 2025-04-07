import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuniEditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: MuniEditComponent;
  let fixture: ComponentFixture<MuniEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuniEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuniEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
