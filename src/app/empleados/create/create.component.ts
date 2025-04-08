import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Empleados} from '../../models/empleado.model'
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})


export class EmpleadoCreateComponent {
  private apiUrl = environment.apiUrl; 
  //estadosCivil2: any[] = [];
  
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
 

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  router = inject(Router)
  empleado = new Empleados();

  crearEmpleado()  {
    this.empleado.usua_Creacion = 2;
    const fecha = new Date();
    this.empleado.empl_FechaCreacion = fecha;  
    this.http.post(`${this.apiUrl}/Empleado/Insertar`, this.empleado)
    .subscribe(() => {
      this.creado.emit();
    }

    );
    
    
    
  }
}

