import {Component,EventEmitter,inject,OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Departamento } from 'src/app/models/departamento.model';

import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class DepaCreateComponent {
  private apiUrl = environment.apiUrl; 
  departamento2: any[] = [];
  http = inject(HttpClient); //inicializa el cliente http
 
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  router = inject(Router); //inicializa el router
  departamento = new Departamento(); //inicializa el objeto departamento

  crearDepartamento() {
    this.departamento.usua_Creacion = 2;
    const fecha = new Date();
    fecha.toLocaleDateString;
    this.departamento.depa_FechaCreacion = new Date(); 

    this.http.post(`${this.apiUrl}/Departamento/Insertar`, this.departamento)
    .subscribe(() =>{
      this.creado.emit();

    }
     
    );

  }
}
