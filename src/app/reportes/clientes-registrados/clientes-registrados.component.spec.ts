import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesRegistradosComponent } from './clientes-registrados.component';

describe('ClientesRegistradosComponent', () => {
  let component: ClientesRegistradosComponent;
  let fixture: ComponentFixture<ClientesRegistradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesRegistradosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientesRegistradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
