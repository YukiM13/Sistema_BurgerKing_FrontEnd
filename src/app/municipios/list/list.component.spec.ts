import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuniListComponent } from './list.component';

describe('ListComponent', () => {
  let component: MuniListComponent;
  let fixture: ComponentFixture<MuniListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuniListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MuniListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
