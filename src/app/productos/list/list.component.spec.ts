import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ProduListComponent;
  let fixture: ComponentFixture<ProduListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProduListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
