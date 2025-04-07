import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsCiCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: EsCiCreateComponent;
  let fixture: ComponentFixture<EsCiCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsCiCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsCiCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
