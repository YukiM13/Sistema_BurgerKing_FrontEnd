import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCreateComponent } from './create.component';

describe('CreateComponent', () => {
  let component: RoleCreateComponent;
  let fixture: ComponentFixture<RoleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
