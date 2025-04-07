import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsCiListComponent } from './list.component';

describe('ListComponent', () => {
  let component: EsCiListComponent;
  let fixture: ComponentFixture<EsCiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsCiListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsCiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
