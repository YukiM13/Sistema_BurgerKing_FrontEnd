import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {Usuario} from '../../models/usuario.model'
import {UsuaCreateComponent} from '../../usuarios/create/create.component'
import { UsuarioEditComponent } from '../edit/edit.component';
import { UsuarioDetailsComponent } from '../details/details.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RestorePasswordComponent } from 'src/app/auth/restore-password/restore-password.component';

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
  imports:[CommonModule, RestorePasswordComponent,RouterModule, UsuaCreateComponent,UsuarioDetailsComponent, UsuarioEditComponent,
     SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  
})
export class UsuaListComponent  implements OnInit {
  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  showDetails = false;
  showChangesPassword = false;
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
          command: () => this.ObtenerUsuario(usuario.usua_Id, 1)
        },
        {
          label: 'Detalles',
          icon: 'pi pi-eye',
          command: () => this.ObtenerUsuario(usuario.usua_Id, 2)
        },
        {
          label: 'Restablecer contraseña',
          icon: 'pi pi-refresh',
          command: () => this.ObtenerUsuario(usuario.usua_Id, 3)
        },
        {
          
          label: usuario.usua_Estado ? 'Desactivar' : 'Activar',
          icon: usuario.usua_Estado ? 'pi pi-ban' : 'pi pi-check-circle',
          command: () => this.confirmarEliminacion(usuario.usua_Id, usuario.usua_Estado)
        }
      ];
    }
  
  
    ObtenerUsuario(id: number, accion:number): void {
    
      this.usurioSeleccionado = id; 
      if(accion == 1)
      {
        this.showEdit = true;
      }
      else if(accion == 2)
      {
        this.showDetails = true;
      }
      else if(accion == 3)
      {
        localStorage.setItem('idRestablecer', id.toString());
          this.showChangesPassword = true;
      }
      
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

    cancelDetails(): void {
      this.showDetails = false;
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

    registroActualizado(): void {
      this.showEdit = false;
      this.listarUsuario();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'El usuario fue actualizado exitosamente'
        });
      }, 100);
    }
    
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    cancelar(){
     
        this.showChangesPassword = false;
      
     
    }

    UsurioEnviado(){
  
        this.showChangesPassword = false;
        this.listarUsuario();
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'La contraseña fue cambiada exitosamente'
          });
        }, 100);
      
    
    }
}
