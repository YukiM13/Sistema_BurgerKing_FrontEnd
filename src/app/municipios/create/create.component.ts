import {Component,EventEmitter,inject,OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Municipios } from 'src/app/models/municipio.model';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Respuesta } from 'src/app/models/respuesta.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ButtonModule,FormsModule, DropdownModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class MunicipioCreateComponent {
  private apiUrl = environment.apiUrl; 
  
  http = inject(HttpClient); //inicializa el cliente http
 
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
  @Output() errorCrear = new EventEmitter<void>();

  cancelarFormulario() {
    this.cancelar.emit();  
  }

    cont = 0;

  constructor(private messageService: MessageService) { }
  router = inject(Router); //inicializa el router
  municipio = new Municipios(); //inicializa el objeto departamento

  ngOnInit(): void {
    this.listarDepartamentos();
    this.cont = 0;
  }
  
 
  

  departamentos: any[] = [];
  //municipos = new Municipios();

  listarDepartamentos(): void {
    this.http.get<any[]>(`${this.apiUrl}/Departamento/Listar`)
      .subscribe({
        next: (response) => {
          
         this.departamentos = response;
          
         // console.log(this.departamentos);
          
        },
        error: (error) => {
         
          this.departamentos = [];
        }
      });
  }


  limpiarEspacioInicial() {
    if (this.municipio.muni_Codigo) {
      this.municipio.muni_Codigo = this.municipio.muni_Codigo.replace(/^\s+/, '');
    }
  }

  crearMunicipio() {
    this.cont = 1;
    if(!this.municipio.muni_Codigo.trim() || !this.municipio.depa_Codigo || !this.municipio.muni_Descripcion.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Campos Vacios.'
      });
      return;
    }

    this.municipio.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
    const fecha = new Date();
    fecha.toLocaleDateString;
    this.municipio.muni_FechaCreacion = new Date(); 

    this.http.post<Respuesta<Municipios>>(`${this.apiUrl}/Municipio/Insertar`, this.municipio)
    .subscribe({
      next: (response) => {
      if (response && response.data.codeStatus >0) {
        console.log(response)
        this.creado.emit();
      } else {
        this.errorCrear.emit();
      }
    }
    });

  }
}
