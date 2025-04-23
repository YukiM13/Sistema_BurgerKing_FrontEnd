import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import { Cliente } from '../../models/clientes.model'
import { ClienteCreateComponent } from '../create/create.component';

import { ClienteDetailsComponent} from  '../details/details.component';
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

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ClienteCreateComponent, ClienteDetailsComponent,
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

export class ClienteListComponent implements OnInit {

  private apiUrl = environment.apiUrl;

  showDetails = false;
  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];
  clienteSeleccionado: any;
  clientes: any[] = [];
  cliente = new Cliente();


  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    this.http.get(`${this.apiUrl}/Cliente/Listar`)
      .subscribe((res: any) => {
        this.clientes = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }


  crearAcciones(cliente: any): MenuItem[] {
    return [
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this. ObtenerCliente(cliente.clie_Identidad_Rtn, 2),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(cliente.clie_Id),
      }
    ];
  }

  ObtenerCliente(id: string, accion: number): void {
    
    this.clienteSeleccionado = id; // solo el ID
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
        message: '¿Estás seguro que deseas eliminar este Cliente?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarCliente(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  
  
    EliminarCliente(id: number): void {
      this.cliente.clie_Id = id;
      this.http.post(`${this.apiUrl}/Cliente/Nose`, this.cliente)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Cliente eliminado'
          });
          this.listarClientes();
        });
    }
  


    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarClientes();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listarClientes();
    }


     cancelDetails(): void {
      this.showDetails = false;
      this.listarClientes();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarClientes();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Cliente creado exitosamente'
        });
      }, 100);
    }

    registroActualizado(): void {
      this.showEdit = false;
      this.listarClientes();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'El cliente fue actualizado exitosamente'
        });
      }, 100);
    }

    crearError(): void {
      this.showCreate = false;
      this.listarClientes();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El cliente no se pudo crear'
        });
      }, 100);
    }

    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
