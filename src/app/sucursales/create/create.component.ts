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


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ToastModule],
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
    
    // Crear un objeto con el código de departamento para enviarlo en el cuerpo de la solicitud
    const departamento = {
      depa_Codigo: depaCodigo
    };
    
    // Usar el endpoint específico para obtener municipios por departamento
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
    if(!this.sucursal.sucu_Descripcion || !this.sucursal.muni_Codigo || !this.sucursal.sucu_Direccion)
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Campos Vacios.'
      });
      return;
    }


    this.sucursal.usua_Creacion = 2;
    const fecha = new Date();
    this.sucursal.sucu_FechaCreacion = fecha;  
    this.http.post(`${this.apiUrl}/Sucursal/Insertar`, this.sucursal)
    .subscribe(() => {
      this.creado.emit();
    }

    );
    
    
    
  }
}
