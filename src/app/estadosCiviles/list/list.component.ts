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
  imports: [CommonModule, RouterModule, EsCiCreateComponent, EsCiEditComponent, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule],
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
export class EsCiListComponent implements OnInit {

  private apiUrl = environment.apiUrl;


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
        command: () => this.ObtenerEstadoCivil(estadoCivil.esCi_Id)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        // Puedes añadir lógica si se desea
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(estadoCivil.esCi_Id)
      }
    ];
  }


  ObtenerEstadoCivil(id: number): void {
    this.estadoCivil.esCi_Id = id;
    this.http.post<EstadoCivil>(`${this.apiUrl}/EstadoCivil/Find`, this.estadoCivil)
      .subscribe(data => {
        this.estadoCivilSeleccionado = data;
        this.showEdit = true;
      });
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
    this.http.post(`${this.apiUrl}/EstadoCivil/Eliminar`, this.estadoCivil)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Estado civil eliminado'
        });
        this.listarEstadosCiviles();
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


}
