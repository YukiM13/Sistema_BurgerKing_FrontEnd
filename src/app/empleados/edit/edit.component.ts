import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Empleados } from '../../models/empleado.model'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InputMaskModule, SelectButtonModule , CalendarModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class EmpleadoEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() empleId: number = 0;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  empleado = new Empleados();
  cont = 0;

  sexoOptions = [
    { label: 'Femenino', value: 'F' },
    { label: 'Masculino', value: 'M' }
  ];

  estadoCivil: any[] = [];
  listarEstadoCivil(): void {
    this.http.get<any[]>(`${this.apiUrl}/EstadoCivil/Listar`)
      .subscribe({
        next: (response) => {
          this.estadoCivil = response;
        },
        error: (error) => {
          console.error('Error al listar los estados civiles:', error);
        }
      });
  }

  cargo: any[] = [];
  listarCargo(): void {
    this.http.get<any[]>(`${this.apiUrl}/Cargo/Listar`)
      .subscribe({
        next: (response) => {
          this.cargo = response;
        },
        error: (error) => {
          console.error('Error al listar los estados civiles:', error);
        }
      });
  }

  sucursal: any[] = [];
  listarSucursal(): void {
    this.http.get<any[]>(`${this.apiUrl}/Sucursal/Listar`)
      .subscribe({
        next: (response) => {
          this.sucursal = response;
        },
        error: (error) => {
          console.error('Error al listar los estados civiles:', error);
        }
      });
  }

  constructor(private messageService: MessageService) { }

  EditarEmpleado()  {
    this.cont = 1;
    if(!this.empleado.empl_Nombre.trim() || !this.empleado.empl_Apellido || !this.empleado.empl_FechaNacimiento || !this.empleado.empl_Identidad || !this.empleado.empl_Sexo  || !this.empleado.esCi_Id || !this.empleado.carg_Id || !this.empleado.sucu_Id )
      {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia!',
          detail: 'Campos Vacios.'
        });
        return;
      }

    this.empleado.usua_Modificacion = 2;
    this.empleado.empl_FechaModificacion = new Date();
    this.http.put(`${this.apiUrl}/Empleado/Actualizar`, this.empleado)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }

  ngOnInit(): void {
    this.listarCargo();
    this.listarEstadoCivil();
    this.listarSucursal();

    this.empleado.empl_Id = this.empleId;
    this.cont = 0;
    this.http.post<Empleados[]>(`${this.apiUrl}/Empleado/Buscar`, this.empleado)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.empleado = data[0];
          console.log("Respuesta API:", data); 

          if (this.empleado.empl_FechaNacimiento) {
            this.empleado.empl_FechaNacimiento = new Date(this.empleado.empl_FechaNacimiento);
          }
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }

}
