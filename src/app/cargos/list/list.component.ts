import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import { Cargo } from '../../models/cargos.model'
import { CargoCreateComponent } from '../create/create.component';
import { CargoEditComponent } from '../edit/edit.component';
import { CargoDetailsComponent} from  '../details/details.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';



import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CargoCreateComponent, CargoEditComponent, CargoDetailsComponent, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule, TableModule,InputTextModule],
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

export class CargosListComponent implements OnInit {

  private apiUrl = environment.apiUrl;

  showDetails = false;
  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];
  cargoSeleccionado: any;
  cargos: any[] = [];
  cargo = new Cargo();


  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarCargos();
  }

  listarCargos(): void {
    this.http.get(`${this.apiUrl}/Cargo/Listar`)
      .subscribe((res: any) => {
        this.cargos = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }


  crearAcciones(cargo: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.ObtenerCargo(cargo.carg_Id, 1)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this.ObtenerCargo(cargo.carg_Id, 2)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(cargo.carg_Id),
      }
    ];
  }

  
  ObtenerCargo(id: number, accion:number): void {
    
    this.cargoSeleccionado = id; // solo el ID
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
        message: '¿Estás seguro que deseas eliminar este Cargo?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarCargo(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  
  
    EliminarCargo(id: number): void {
      this.cargo.carg_Id = id;
      console.log(this.cargo);
      this.http.post(`${this.apiUrl}/Cargo/Eliminar`, this.cargo)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Cargo eliminado'
          });
          this.listarCargos();
        });
    }
  


    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarCargos();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listarCargos();
    }

    cancelDetails(): void {
      this.showDetails = false;
      this.listarCargos();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarCargos();
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
      this.listarCargos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El cargo no se pudo crear'
        });
      }, 100);
    }

    registroActualizado(): void {
      this.showEdit = false;
      this.listarCargos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'El cargo fue actualizado exitosamente'
        });
      }, 100);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }
}
