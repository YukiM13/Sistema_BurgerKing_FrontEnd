import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { environment } from 'src/enviroments/enviroment';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { Roles } from '../../models/rol.model';
import { PantallasPorRoles } from '../../models/pantallasPorRol.model';
import { Pantallas } from '../../models/pantallas.model';
 

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class RoleCreateComponent {
  private apiUrl = environment.apiUrl; 
    
      http = inject(HttpClient);
      @Output() cancelar = new EventEmitter<void>();  
      @Output() creado = new EventEmitter<void>();
     cont = 0;

     cancelarFormulario() {
      this.cancelar.emit();  
    }

    constructor(private messageService: MessageService) { }
     router = inject(Router);

    ngOninit() {
      this.cont = 0;
    }

    pantallas: any[] = [];
  //municipos = new Municipios();

  listarPantallas(): void {
    this.http.get<any[]>(`${this.apiUrl}/Departamento/Listar`)
      .subscribe({
        next: (response) => {
          
         this.pantallas = response;
          
         // console.log(this.departamentos);
          
        },
        error: (error) => {
         
          this.pantallas = [];
        }
      });
  }





}
