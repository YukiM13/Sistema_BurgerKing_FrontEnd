import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleListComponent } from './list.component';

describe('ListComponent', () => {
  let component: EmpleListComponent;
  let fixture: ComponentFixture<EmpleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
