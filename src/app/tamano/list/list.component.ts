import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {Tamano} from '../../models/tamano.model'
 import {TamanoCreateComponent} from '../../tamano/create/create.component';
// import {TamaEditComponent} from '../../tamano/edit/edit.component';
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
  imports: [CommonModule, RouterModule, TamanoCreateComponent,
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
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ]
})
export class TamaListComponent implements OnInit {

  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];
  tamanoSeleccionado: any;
  tamanos: any[] = [];
  tamano = new Tamano();


  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarTamanos();
  }


  listarTamanos(): void {
    this.http.get(`${this.apiUrl}/Tamano/Listar`)
      .subscribe((res: any) => {
        this.tamanos = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }


  crearAcciones(tamano: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.ObtenerTamano(tamano.tama_Id)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        // Puedes añadir lógica si se desea
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(tamano.tama_Id)
      }
    ];
  }


  ObtenerTamano(id: number): void {
    this.tamano.tama_Id = id;
    this.http.post<Tamano>(`${this.apiUrl}/Tamano/Find`, this.tamano)
      .subscribe(data => {
        this.tamanoSeleccionado = data;
        this.showEdit = true;
      });
  }


  confirmarEliminacion(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas eliminar este tamaño?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => this.EliminarTamano(id),
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'No se eliminó el registro'
        });
      }
    });
  }


  EliminarTamano(id: number): void {
    this.tamano.tama_Id = id;
    this.http.post(`${this.apiUrl}/Tamano/Eliminar`, this.tamano)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Tamaño eliminado'
        });
        this.listarTamanos();
      });
  }

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  cancelCreate(): void {
    this.showCreate = false;
    this.listarTamanos();
  }

  cancelEdit(): void {
    this.showEdit = false;
    this.listarTamanos();
  }

  registroCreado(): void {
    this.showCreate = false;
    this.listarTamanos();
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Exito',
        detail: 'Tamaño creado exitosamente'
      });
    }, 100);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
