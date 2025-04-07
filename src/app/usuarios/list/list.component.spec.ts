import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuaListComponent } from './list.component';

describe('ListComponent', () => {
  let component: UsuaListComponent;
  let fixture: ComponentFixture<UsuaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuaListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
