import {Component,EventEmitter,inject,OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Municipios } from 'src/app/models/municipio.model';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from "primeng/inputtext";

import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InputTextModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class MunicipioCreateComponent {
  private apiUrl = environment.apiUrl; 
  //departamento2: any[] = [];
  http = inject(HttpClient); //inicializa el cliente http
 
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();

  cancelarFormulario() {
    this.cancelar.emit();  
  }

    


  router = inject(Router); //inicializa el router
  municipio = new Municipios(); //inicializa el objeto departamento

  ngOnInit(): void {
    this.listarMunicipios();
  }
  
 
  

  departamentos: any[] = [];
  //municipos = new Municipios();

  listarMunicipios(): void {
    this.http.get<any[]>(`${this.apiUrl}/Departamento/Listar`)
      .subscribe({
        next: (response) => {
          
          this.departamentos = response.map(departamento => ({
            label: departamento.depa_Descripcion,
            value: departamento.depa_Codigo
          }));
          
          console.log(this.departamentos);
          
        },
        error: (error) => {
         
          this.departamentos = [];
        }
      });
  }


  crearMunicipio() {
    this.municipio.usua_Creacion = 2;
    const fecha = new Date();
    fecha.toLocaleDateString;
    this.municipio.muni_FechaCreacion = new Date(); 

    this.http.post(`${this.apiUrl}/Municipio/Insertar`, this.municipio)
    .subscribe(() =>{
      this.creado.emit();

    }
     
    );

  }
}
