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
import { PickListModule } from 'primeng/picklist';
import { ButtonModule } from 'primeng/button';


import { Roles } from '../../models/rol.model';
import { PantallasPorRoles } from '../../models/pantallasPorRol.model';
import { Pantallas } from '../../models/pantallas.model';
 

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Respuesta } from 'src/app/models/respuesta.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule,ButtonModule, FormsModule, ToastModule, PickListModule],
  providers: [MessageService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  animations: [
    trigger('collapse', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('', style({ height: '', opacity: 1 })),
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
export class RoleCreateComponent {
  private apiUrl = environment.apiUrl; 
    
    http = inject(HttpClient);
    @Output() cancelar = new EventEmitter<void>();  
    @Output() creado = new EventEmitter<void>();
    @Output() errorCrear = new EventEmitter<void>();
    cont = 0;

    cancelarFormulario() {
      this.cancelar.emit();  
    }

    constructor(private messageService: MessageService) { }
     router = inject(Router);

    ngOnInit() {
      this.cont = 0;
      this.listaPantallas();
      this.files1 = this.pantallasList;
      console.log(this.files1);
    }

    pantallas: any[] = [];
    pantallaPorRol = new PantallasPorRoles();
    rolAccion = new Roles();
    ScopedID:any;
    pantallas2: any[] = [];
    pantallasList: any[] = [];
    files1: any[] = [];
  

  

  listaPantallas(): void {
    this.http.get(`${this.apiUrl}/Pantalla/Listar`)
      .subscribe((res: any) => {
        console.log('Pantallas', res);
        this.pantallasList = res.map((pantalla: any) => ({
          ...pantalla
        }));
        this.files1 = this.pantallasList;
      });
  }


  guardar(){
    this.cont = 1;
    if(!this.rolAccion.role_Descripcion.trim() || this.pantallas2.length == 0)
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Campos Vacios.'
      });
      return;
    }

    this.rolAccion.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
    const fecha = new Date();
    fecha.toLocaleDateString();
    this.rolAccion.role_FechaCreacion =fecha;

    
    console.log('Rol recibidas:', this.rolAccion);

    this.http.post<any>(`${this.apiUrl}/Rol/Insertar`, this.rolAccion)
    .subscribe(data => {
      console.log('Scope del rol', data);
      this.ScopedID=data[0].role_Id;
      console.log('ScopeID en num', this.ScopedID);
      
     
      if(this.ScopedID>0){
        for(var i=0;i<this.pantallas2.length;i++)
        {
          this.pantallaPorRol.pant_Id = this.pantallas2[i].pant_Id;
          this.pantallaPorRol.role_Id = this.ScopedID;
          console.log('Este debera de ser el ID', this.pantallaPorRol.role_Id);
          this.pantallaPorRol.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
          const fecha = new Date();
          fecha.toLocaleDateString();
          this.pantallaPorRol.roPa_FechaCreacion =fecha;
          console.log(this.ScopedID, this.pantallas2[i].pant_Id);
          console.log('Pantallas por rol', this.pantallaPorRol);

          this.http.post<Respuesta<PantallasPorRoles>>(`${this.apiUrl}/RolPorPantallas/Insertar`, this.pantallaPorRol)
          .subscribe({
            next: (response) => {
            if (response && response.data.codeStatus >0) {
              console.log(response)
              this.creado.emit();
            } else {
              this.errorCrear.emit();
            }
          }
          });
       
      }

    };
    }


  )

}}
