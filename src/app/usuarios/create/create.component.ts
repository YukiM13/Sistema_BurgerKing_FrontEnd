import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Usuario} from '../../models/usuario.model'
import { environment } from 'src/enviroments/enviroment';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ToggleButtonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class UsuaCreateComponent {
     private apiUrl = environment.apiUrl; 
      //usuarios2: any[] = [];
      http = inject(HttpClient);
      @Output() cancelar = new EventEmitter<void>();  
      @Output() creado = new EventEmitter<void>();
     

      cancelarFormulario() {
        this.cancelar.emit();  
      }
      router = inject(Router)
      usuario = new Usuario();
      crearUsuario()  {
        this.usuario.usua_Creacion = 2;
        const fecha = new Date();
        this.usuario.usua_FechaCreacion = fecha;  
       
        this.http.post(`${this.apiUrl}/Usuario/Insertar`, this.usuario)
        .subscribe(() => {
          this.creado.emit();
        }
    
        );
        
      }

      onAdminToggleChange(event: any) {
        console.log('Valor de usua_Admin:', this.usuario.usua_Admin);
      }
      

      ngOnInit(): void {
        this.listarEmpleado();
        this.listarRol();
      }

   empleados: any[] = [];

    listarEmpleado(): void {
      this.http.get<any[]>(`${this.apiUrl}/Empleado/Listar`)
        .subscribe({
          next: (response) => {
            this.empleados = response; 
            console.log(this.empleados);
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
      
}
