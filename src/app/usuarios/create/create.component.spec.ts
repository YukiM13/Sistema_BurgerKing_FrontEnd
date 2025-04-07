import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuaCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: UsuaCreateComponent;
  let fixture: ComponentFixture<UsuaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuaCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
