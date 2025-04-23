import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Usuario } from '../../models/usuario.model'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ToggleButtonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class UsuarioEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() usuaId: number = 0;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();
  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  usuario = new Usuario();
  cont = 0;

  constructor(private messageService: MessageService) { }

  EditarUsuario()  {
    this.cont = 1;
    if(!this.usuario.usua_Usuario.trim() || !this.usuario.usua_Correo.trim() || !this.usuario.empl_Id || !this.usuario.role_Id) 
      {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia!',
          detail: 'Campos Vacios.'
        });
        return;
      }

    this.usuario.usua_Modificacion =  Number(localStorage.getItem('usuario_id'));
    this.usuario.usua_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/Usuario/Actualizar`, this.usuario)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }

  empleados: any[] = [];

  listarEmpleado(): void {
    this.http.get<any[]>(`${this.apiUrl}/Empleado/Listar`)
      .subscribe({
        next: (response) => {
          this.empleados = response; 
          //console.log(this.empleados);
        },
        error: (error) => {
          this.empleados = [];
        }
      });
    }

  roles: any[] = [];
  listarRol(): void {
    this.http.get<any[]>(`${this.apiUrl}/Rol/Listar`)
      .subscribe({
        next: (response) => {
          this.roles = response; 
        },
        error: (error) => {
          this.roles = [];
        }
      });
    }

  ngOnInit(): void {
    this.listarEmpleado();
    this.listarRol();

    this.usuario.usua_Id = this.usuaId;
    this.cont = 0;
    this.http.post<Usuario[]>(`${this.apiUrl}/Usuario/Buscar`, this.usuario)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.usuario = data[0];
          console.log("Respuesta API:", data); 
          
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }

}
