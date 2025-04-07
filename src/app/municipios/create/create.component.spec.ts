import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuniCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: MuniCreateComponent;
  let fixture: ComponentFixture<MuniCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuniCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuniCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
