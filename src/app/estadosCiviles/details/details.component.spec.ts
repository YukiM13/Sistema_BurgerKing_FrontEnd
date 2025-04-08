import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsCiDetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: EsCiDetailsComponent;
  let fixture: ComponentFixture<EsCiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsCiDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsCiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
