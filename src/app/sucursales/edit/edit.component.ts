import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Sucursal } from '../../models/sucursales.model'
import { Municipios } from 'src/app/models/municipio.model';
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class SucursalEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() sucuId: number = 0;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();

    municipiosFiltrados= new Municipios();
    departamentoSeleccionado: string = '';

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  sucursal = new Sucursal();
  cont = 0;
  municipios: any[] = [];
  departamentos: any[] = [];

  constructor(private messageService: MessageService) { }
  
  filtrarMunicipiosPorDepartamento(depaCodigo: string): void {
    //console.log('entro codigo obtenido', depaCodigo);
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


  EditarSucursal()  {
    this.cont = 1;
    if(!this.sucursal.sucu_Descripcion.trim())
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia!',
        detail: 'Campos Vacios.'
      });
      return;
    }

    this.sucursal.usua_Modificacion = 2;
    this.sucursal.sucu_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/Sucursal/Actualizar`, this.sucursal)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }

  ngOnInit(): void {
    this.listarDepartamentos();
   // this.filtrarMunicipiosPorDepartamento(this.departamentoSeleccionado);
    this.sucursal.sucu_Id = this.sucuId;
    this.cont = 0;
    this.http.post<Sucursal[]>(`${this.apiUrl}/Sucursal/Buscar`, this.sucursal)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.sucursal = data[0];
          console.log("Respuesta API:", data); 

          
          
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }

}
