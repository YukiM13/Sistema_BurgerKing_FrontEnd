import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Empleados} from '../../models/empleado.model'
import { environment } from 'src/enviroments/enviroment';
import { DropdownModule } from 'primeng/dropdown';
import {ToggleButtonModule } from 'primeng/togglebutton';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Respuesta } from '../../models/respuesta.model';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule,InputMaskModule, FormsModule, DropdownModule, ToggleButtonModule, CalendarModule, SelectButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})


export class EmpleadoCreateComponent implements OnInit {
  private apiUrl = environment.apiUrl; 
  //estadosCivil2: any[] = [];
  
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
  @Output() errorCrear = new EventEmitter<void>();


  constructor(private messageService: MessageService) { }
  cont = 0;
  cancelarFormulario() {
    this.cancelar.emit();  
  }

  router = inject(Router)
  empleado = new Empleados();

  crearEmpleado()  {
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

    const sexo = this.empleado.empl_Sexo ? 'M' : 'F';
    this.empleado.empl_Sexo = sexo;

    this.empleado.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
    const fecha = new Date();
    this.empleado.empl_FechaCreacion = fecha;  
    this.http.post<Respuesta<Empleados>>(`${this.apiUrl}/Empleado/Insertar`, this.empleado)
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

  ngOnInit(): void {
    this.listarEstadoCivil();
    this.listarCargo();
    this.listarSucursal();
    this.empleado.empl_Sexo = 'F';
    this.cont = 0;
  }

}

