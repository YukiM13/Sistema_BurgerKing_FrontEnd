import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamaListComponent } from './list.component';

describe('ListComponent', () => {
  let component: TamaListComponent;
  let fixture: ComponentFixture<TamaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TamaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TamaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
