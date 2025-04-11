import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {Usuario} from '../../models/usuario.model'
import {UsuaCreateComponent} from '../../usuarios/create/create.component'
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
  imports:[CommonModule, RouterModule, UsuaCreateComponent, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule],
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
export class UsuaListComponent  implements OnInit {
  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];
    usurioSeleccionado: any;
    usuarios: any[] = [];
    usuario = new Usuario();
  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}


  ngOnInit(): void {
      this.listarUsuario();
    }
  
  
    listarUsuario(): void {
      this.http.get(`${this.apiUrl}/Usuario/Listar`)
        .subscribe((res: any) => {
          this.usuarios = res.map((estado: any) => ({
            ...estado,
            acciones: this.crearAcciones(estado)
          }));
        });
    }
  
  
    crearAcciones(usuario: any): MenuItem[] {
      return [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => this.ObtenerUsuario(usuario.usua_Id)
        },
        {
          label: 'Detalles',
          icon: 'pi pi-eye',
          // Puedes añadir lógica si se desea
        },
        {
          
          label: usuario.usua_Estado ? 'Desactivar' : 'Activar',
          icon: usuario.usua_Estado ? 'pi pi-ban' : 'pi pi-check-circle',
          command: () => this.confirmarEliminacion(usuario.usua_Id, usuario.usua_Estado)
        }
      ];
    }
  
  
    ObtenerUsuario(id: number): void {
      this.usuario.usua_Id = id;
      this.http.post<Usuario>(`${this.apiUrl}/Usuario/Buscar`, this.usuario)
        .subscribe(data => {
          this.usurioSeleccionado = data;
          this.showEdit = true;
        });
    }
  
  
    confirmarEliminacion(id: number, estado: boolean): void {
      this.confirmationService.confirm({
        message: estado? '¿Estás seguro que deseas desactivar este usuario?': '¿Estás seguro que deseas activar este usuario?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarUsuario(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: estado? 'No se desactivo el usuario':'No se activo el usuario' 
          });
        }
      });
    }
  
  
    EliminarUsuario(id: number): void {
      this.usuario.usua_Id = id;
      this.http.put(`${this.apiUrl}/Usuario/Activar`, this.usuario)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Operacion realizada con extio'
          });
          this.listarUsuario();
        });
    }
  
    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarUsuario();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listarUsuario();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarUsuario();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Usuario creado exitosamente'
        });
      }, 100);
    }
    crearError(): void {
      this.showCreate = false;
      this.listarUsuario();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El usuario no se pudo crear'
        });
      }, 100);
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
