import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {Roles} from '../../models/rol.model'
import {RoleCreateComponent} from '../../roles/create/create.component';
import {RoleEditComponent} from '../../roles/edit/edit.component';
import {RolDetailsComponent} from '../../roles/details/details.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';


import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { MenuItem } from 'primeng/api';
import { Respuesta } from 'src/app/models/respuesta.model';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SplitButtonModule, RoleCreateComponent, RolDetailsComponent, RoleEditComponent,
            ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule],
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
export class RoleListComponent implements OnInit {
  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  showDetails = false;
  loading = [false, false, false, false];
  rolSeleccionado: any;
  roles: any[] = [];
  rol = new Roles();


  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarRoles();
  }


  listarRoles(): void {
    this.http.get(`${this.apiUrl}/Rol/Listar`)
      .subscribe((res: any) => {
        this.roles = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }


  crearAcciones(rol: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.ObtenerRol(rol.role_Id, 1)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this.ObtenerRol(rol.role_Id, 2)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(rol.role_Id)
      }
    ];
  }


  ObtenerRol(id: number, accion:number): void {
    
    this.rolSeleccionado = id; // solo el ID
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
    console.log('ID a eliminar:', id);
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas eliminar este rol?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.EliminarRol(id),
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se eliminó el registro'
        });
      }
    });
  }


  EliminarRol(id: number): void {
    this.rol.role_Id = id;
    console.log('Rol a eliminar:', this.rol);
    //return;
    this.http.post<Respuesta<Roles>>(`${this.apiUrl}/Rol/Eliminar`, this.rol)
    .subscribe({
      next: (response) => {
      if (response && response.data.codeStatus >0) {
        console.log(response)
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Rol eliminado'
        });
        this.listarRoles();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo eliminar!',
          detail: 'El rol esta siendo utilizado'
        });
        this.listarRoles();
      }
    }
    });
  }

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  cancelCreate(): void {
    this.showCreate = false;
    this.listarRoles();
  }

  cancelEdit(): void {
    this.showEdit = false;
    this.listarRoles();
  }
  cancelDetails(): void {
    this.showDetails = false;
    this.listarRoles();
  }

  registroCreado(): void {
    this.showCreate = false;
    this.listarRoles();
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'Rol creado exitosamente'
      });
    }, 100);
  }

  crearError(): void {
    this.showCreate = false;
    this.listarRoles();
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El rol no se pudo crear'
      });
    }, 100);
  }

  registroActualizado(): void {
    this.showEdit = false;
    this.listarRoles();
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'El rol fue actualizado exitosamente'
      });
    }, 100);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
