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
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ButtonModule,FormsModule, DropdownModule],
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
    this.departamentoSeleccionado = depaCodigo;
  
    if (!depaCodigo) {
      this.sucursal.muni_Codigo = '';
      return;
    }
  
    const departamento = { depa_Codigo: depaCodigo };
  
    this.http.post<any[]>(`${this.apiUrl}/Municipio/FindPorDepartamento`, departamento)
      .subscribe({
        next: (response) => {
          this.municipios = response;
  
          // 🔁 Aquí se fuerza la re-asignación si ya tenía un valor
          if (this.sucursal.muni_Codigo) {
            const muniActual = this.municipios.find(m => m.muni_Codigo === this.sucursal.muni_Codigo);
            if (muniActual) {
              const codigo = this.sucursal.muni_Codigo;
              this.sucursal.muni_Codigo = ''; // ⚠ Limpiar primero
              setTimeout(() => {
                this.sucursal.muni_Codigo = codigo; // 👉 Y luego volver a asignar
              });
            }
          }
        },
        error: () => {
          this.municipios = [];
        }
      });
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

    this.sucursal.usua_Modificacion =  Number(localStorage.getItem('usuario_id'));
    this.sucursal.sucu_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/Sucursal/Actualizar`, this.sucursal)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }

  todosLosMunicipios: any[] = [];

listarTodosLosMunicipios(): void {
  this.http.get<any[]>(`${this.apiUrl}/Municipio/Listar`)
    .subscribe({
      next: (response) => {
        this.todosLosMunicipios = response;
        console.log('Muni', this.todosLosMunicipios);
      },
      error: (error) => {
        console.error('Error al obtener todos los municipios', error);
        this.todosLosMunicipios = [];
      }
    });
}

ngOnInit(): void {
  this.listarDepartamentos();
  this.listarTodosLosMunicipios();

  this.sucursal.sucu_Id = this.sucuId;
  this.cont = 0;

  // Paso 1: Obtener sucursal
  this.http.post<Sucursal[]>(`${this.apiUrl}/Sucursal/Buscar`, this.sucursal).subscribe(data => {
    if (data && data.length > 0) {
      this.sucursal = data[0];

      // Paso 2: Buscar el municipio completo
      const municipio = this.todosLosMunicipios.find(m => m.muni_Codigo === this.sucursal.muni_Codigo);

      if (municipio) {
        // Paso 3: Asignar departamento y cargar municipios
        this.departamentoSeleccionado = municipio.depa_Codigo;

        // Paso 4: Cargar municipios de ese departamento
        const departamento = { depa_Codigo: municipio.depa_Codigo };
        this.http.post<any[]>(`${this.apiUrl}/Municipio/FindPorDepartamento`, departamento)
          .subscribe({
            next: (response) => {
              this.municipios = response;

              // Paso 5: Asegurar que el municipio se seleccione
              const encontrado = this.municipios.find(m => m.muni_Codigo === municipio.muni_Codigo);
              this.sucursal.muni_Codigo = encontrado ? encontrado.muni_Codigo : '';
            },
            error: () => {
              this.municipios = [];
              this.sucursal.muni_Codigo = '';
            }
          });
      }
    }
  });
}



}
