import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCodComponent } from './verification-cod.component';

describe('VerificationCodComponent', () => {
  let component: VerificationCodComponent;
  let fixture: ComponentFixture<VerificationCodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationCodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerificationCodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
