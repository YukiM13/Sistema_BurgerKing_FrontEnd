import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Sucursal} from '../../models/sucursales.model'
import { environment } from 'src/enviroments/enviroment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Respuesta } from 'src/app/models/respuesta.model';
import { Municipios } from 'src/app/models/municipio.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ButtonModule,FormsModule, DropdownModule, ToastModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})




export class SucursalCreateComponent {
 private apiUrl = environment.apiUrl; 
  //estadosCivil2: any[] = [];
  municipios1: Municipios[] = [];
  departamentos: any[] = [];
  municipiosFiltrados= new Municipios();
  departamentoSeleccionado: string = '';
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
  @Output() errorCrear = new EventEmitter<void>();
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    
    this.listarDepartamentos();
  }
  cont = 0;
  municipios: any[] = [];
  //municipos = new Municipios();

  listarMunicipios(): void {
    this.http.get<any[]>(`${this.apiUrl}/Municipio/Listar`)
      .subscribe({
        next: (response) => {
          
          this.municipios = response; 
          
        },
        error: (error) => {
         
          this.municipios = [];
        }
      });
  }

  cancelarFormulario() {
    this.cancelar.emit();  
  }
  router = inject(Router)
  sucursal = new Sucursal();

  filtrarMunicipiosPorDepartamento(depaCodigo: string): void {
    console.log('entro codigo obtenido', depaCodigo);
    this.departamentoSeleccionado = depaCodigo;
    if (!depaCodigo) {
      
      this.sucursal.muni_Codigo = '';
      return;
    }
    
    
    const departamento = {
      depa_Codigo: depaCodigo
    };
    
  
    this.http.post<any[]>(`${this.apiUrl}/Municipio/FindPorDepartamento`, departamento)
      .subscribe({
        next: (response) => {
          
          this.municipios = response; 
          
        },
        error: (error) => {
         
          this.municipios = [];
        }
      });
 
    
    // Resetear el municipio seleccionado
    this.sucursal.muni_Codigo = '';
  }

  //municipos = new Municipios();

  listarDepartamentos(): void {
    this.http.get<any[]>(`${this.apiUrl}/Departamento/Listar`)
      .subscribe({
        next: (response) => {
          
         this.departamentos = response;
          
          console.log(this.departamentos);
          
        },
        error: (error) => {
         
          this.departamentos = [];
        }
      });
  }

  crearSucursal()  {
    this.cont = 1;
    if(!this.sucursal.sucu_Descripcion.trim() || !this.sucursal.muni_Codigo || !this.sucursal.sucu_Direccion.trim())
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Campos Vacios.'
      });
      return;
    }


    this.sucursal.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
    const fecha = new Date();
    this.sucursal.sucu_FechaCreacion = fecha;  
    this.http.post<Respuesta<Sucursal>>(`${this.apiUrl}/Sucursal/Insertar`, this.sucursal)
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
