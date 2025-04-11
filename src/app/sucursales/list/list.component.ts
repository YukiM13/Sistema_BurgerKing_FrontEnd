import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import { Sucursal } from '../../models/sucursales.model'
import {SucursalCreateComponent } from '../create/create.component';
//import {EsCiEditComponent} from '../edit/edit.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Municipios  } from '../../models/municipio.model'

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { MenuItem } from 'primeng/api';
import { an } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SplitButtonModule,
     SucursalCreateComponent ,ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule,  DropdownModule,],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('collapse', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ]
})

export class SucursalListComponent implements OnInit {

  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];
  sucursalSeleccionado: any;
  sucursales: any[] = [];
  sucursal = new Sucursal();



  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarSucursales();
    
  }

  listarSucursales(): void {
    this.http.get(`${this.apiUrl}/Sucursal/Listar`)
      .subscribe((res: any) => {
        this.sucursales = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }

  

  crearAcciones(sucursal: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        //command: () => this.ObtenerEstadoCivil(cargo.car)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        // Puedes añadir lógica si se desea
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(sucursal.sucu_Id)
      }
    ];
  }

  /*
   ObtenerEstadoCivil(id: number): void {
      this.estadoCivil.esCi_Id = id;
      this.http.post<EstadoCivil>(`${this.apiUrl}/EstadoCivil/Find`, this.estadoCivil)
        .subscribe(data => {
          this.estadoCivilSeleccionado = data;
          this.showEdit = true;
        });
    }
  
  */
    confirmarEliminacion(id: number): void {
      this.confirmationService.confirm({
        message: '¿Estás seguro que deseas eliminar esta Sucursal?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarSucursal(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  
  
    EliminarSucursal(id: number): void {
      this.sucursal.sucu_Id = id;
      this.http.post(`${this.apiUrl}/Sucursal/Eliminar`, this.sucursal)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Sucursal eliminado'
          });
          this.listarSucursales();
        });
    }
  


    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarSucursales();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listarSucursales();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarSucursales();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Cargo creado exitosamente'
        });
      }, 100);
    }
    crearError(): void {
      this.showCreate = false;
      this.listarSucursales();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La sucursal no se pudo crear'
        });
      }, 100);
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
