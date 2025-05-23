import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {EstadoCivil} from '../../models/estadosCiviles.model'
import {EsCiCreateComponent} from '../create/create.component';
import {EsCiEditComponent} from '../edit/edit.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { EsCiDetailsComponent } from '../details/details.component';
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
  imports: [CommonModule, RouterModule, EsCiCreateComponent, EsCiEditComponent, EsCiDetailsComponent ,SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule,TableModule,InputTextModule],
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
export class EsCiListComponent implements OnInit {

  private apiUrl = environment.apiUrl;

  showDetails = false;
  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];
  estadoCivilSeleccionado: any;
  estadosCivil: any[] = [];
  estadoCivil = new EstadoCivil();


  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarEstadosCiviles();
  }

  
  listarEstadosCiviles(): void {
    this.http.get(`${this.apiUrl}/EstadoCivil/Listar`)
      .subscribe((res: any) => {
        this.estadosCivil = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }


  crearAcciones(estadoCivil: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.ObtenerEstadoCivil(estadoCivil.esCi_Id, 1)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this.ObtenerEstadoCivil(estadoCivil.esCi_Id,2)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(estadoCivil.esCi_Id)
      }
    ];
  }


  ObtenerEstadoCivil(id: number, accion:number): void {
    
      this.estadoCivilSeleccionado = id; // solo el ID
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
      message: '¿Estás seguro que deseas eliminar este estado civil?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.EliminarEstadoCivil(id),
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se eliminó el registro'
        });
      }
    });
  }


  EliminarEstadoCivil(id: number): void {
    this.estadoCivil.esCi_Id = id;
   
    this.http.post<Respuesta<EstadoCivil>>(`${this.apiUrl}/EstadoCivil/Eliminar`, this.estadoCivil)
    .subscribe({
      next: (response) => {
      if (response && response.data.codeStatus >0) {
        console.log(response)
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Estado Civil eliminado'
        });
        this.listarEstadosCiviles();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo eliminar!',
          detail: 'El estado civil esta siendo utilizado'
        });
        this.listarEstadosCiviles();
      }
    }
    });
  }

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  cancelCreate(): void {
    this.showCreate = false;
    this.listarEstadosCiviles();
  }

  cancelEdit(): void {
    this.showEdit = false;
    this.listarEstadosCiviles();
  }
  cancelDetails(): void {
    this.showDetails = false;
    this.listarEstadosCiviles();
  }
  registroCreado(): void {
    this.showCreate = false;
    this.listarEstadosCiviles();
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'Estado civil creado exitosamente'
      });
    }, 100);
  }
  crearError(): void {
    this.showCreate = false;
    this.listarEstadosCiviles();
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El estado civil no se pudo crear'
      });
    }, 100);
  }

  registroActualizado(): void {
    this.showEdit = false;
    this.listarEstadosCiviles();
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'Estado civil actualizado exitosamente'
      });
    }, 100);
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
