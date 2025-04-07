import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuaEditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: UsuaEditComponent;
  let fixture: ComponentFixture<UsuaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuaEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
