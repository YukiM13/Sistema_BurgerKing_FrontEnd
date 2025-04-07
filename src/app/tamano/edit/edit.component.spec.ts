import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamaEditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: TamaEditComponent;
  let fixture: ComponentFixture<TamaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TamaEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TamaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
