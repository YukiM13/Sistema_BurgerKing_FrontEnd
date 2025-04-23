import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import { Sucursal } from '../../models/sucursales.model'
import {SucursalCreateComponent } from '../create/create.component';
import { SucursalEditComponent } from '../edit/edit.component';
import { SucursalDetailsComponent} from  '../details/details.component';
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
import { Respuesta } from 'src/app/models/respuesta.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SplitButtonModule, SucursalEditComponent, SucursalDetailsComponent,
     SucursalCreateComponent ,ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule,  DropdownModule,],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  
})

export class SucursalListComponent implements OnInit {

  private apiUrl = environment.apiUrl;


  showCreate = false;
  showDetails = false;
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
        command: () => this.ObtenerSucursal(sucursal.sucu_Id, 1)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this.ObtenerSucursal(sucursal.sucu_Id, 2)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(sucursal.sucu_Id)
      }
    ];
  }

  ObtenerSucursal(id: number, accion:number): void {
    
    this.sucursalSeleccionado = id; // solo el ID
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
      this.http.post<Respuesta<Sucursal>>(`${this.apiUrl}/Sucursal/Eliminar`, this.sucursal)
      .subscribe({
        next: (response) => {
        if (response && response.data.codeStatus >0) {
          console.log(response)
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Sucursal eliminado'
          });
          this.listarSucursales();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo eliminar!',
            detail: 'La sucursal esta siendo utilizado'
          });
          this.listarSucursales();
        }
      }
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

    cancelDetails(): void {
      this.showDetails = false;
      this.listarSucursales();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarSucursales();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Sucursal creado exitosamente'
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

    registroActualizado(): void {
      this.showEdit = false;
      this.listarSucursales();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'La sucursal fue actualizada exitosamente'
        });
      }, 100);
    }

    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
