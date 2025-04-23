import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {Empleados} from '../../models/empleado.model'
 import { EmpleadoCreateComponent } from '../../empleados/create/create.component';
import {EmpleadoEditComponent} from '../../empleados/edit/edit.component';
import { EmpleadoDetailsComponent} from  '../details/details.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Respuesta } from '../../models/respuesta.model'


import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, EmpleadoCreateComponent,EmpleadoDetailsComponent, EmpleadoEditComponent,
     SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('collapse', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        
      ]),
      transition(':leave', [
         style({ height: '0px', opacity: 0 })
      ])
    ])
  ]
 
})
export class EmpleListComponent implements OnInit{
  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  showDetails = false;
  loading = [false, false, false, false];
  empleadoSeleccionado: any;
  empleados: any[] = [];
  empleado = new Empleados();


  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarEmpleados();
  }


  listarEmpleados(): void {
    this.http.get(`${this.apiUrl}/Empleado/Listar`)
      .subscribe((res: any) => {
        this.empleados = res.map((estado: any) => ({
          ...estado,
          empl_FechaNacimiento: estado.empl_FechaNacimiento ? new Date(estado.empl_FechaNacimiento).toLocaleDateString() : null,
          empl_Sexo: estado.empl_Sexo === 'M' ? 'Masculino' : 'Femenino',
          acciones: this.crearAcciones(estado)
        }));

        console.log(this.empleados);

       
      });
  }


  crearAcciones(empleado: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.ObtenerEmpleado(empleado.empl_Id, 1)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this.ObtenerEmpleado(empleado.empl_Id, 2)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(empleado.empl_Id)
      }
    ];
  }


  ObtenerEmpleado(id: number, accion:number): void {
    
    this.empleadoSeleccionado = id; // solo el ID
    if(accion == 1)
    {
      this.showEdit = true;
    }
    else
    {
      this.showDetails = true;
    }
    
  }


  confirmarEliminacion(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas eliminar este empleado?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.EliminarEmpleado(id),
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se eliminó el registro'
        });
      }
    });
  }

 

  EliminarEmpleado(id: number): void {
    this.empleado.empl_Id = id;
    this.http.post<Respuesta<Empleados>>(`${this.apiUrl}/Empleado/Eliminar`, this.empleado)
    .subscribe({
      next: (response) => {
      if (response && response.data.codeStatus >0) {
        console.log(response)
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Empleado eliminado'
        });
        this.listarEmpleados();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo eliminar!',
          detail: 'El empleado esta siendo utilizado'
        });
        this.listarEmpleados();
      }
    }
    });
  }

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  cancelCreate(): void {
    this.showCreate = false;
    this.listarEmpleados();
  }

  cancelEdit(): void {
    this.showEdit = false;
    this.listarEmpleados();
  }

  cancelDetails(): void {
    this.showDetails = false;
    this.listarEmpleados();
  }

  registroCreado(): void {
    this.showCreate = false;
    this.listarEmpleados();
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'Empleado creado exitosamente'
      });
    }, 100);
  }

  crearError(): void {
    this.showCreate = false;
    this.listarEmpleados();
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El empleado no se pudo crear'
      });
    }, 100);
  }

  registroActualizado(): void {
    this.showEdit = false;
    this.listarEmpleados();
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'El empleado fue actualizado exitosamente'
      });
    }, 100);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
