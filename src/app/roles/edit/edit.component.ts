import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PickListModule } from 'primeng/picklist';
import { Respuesta } from 'src/app/models/respuesta.model';
import { Roles } from '../../models/rol.model';
import { PantallasPorRoles } from '../../models/pantallasPorRol.model';
import { Pantallas } from '../../models/pantallas.model';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule,ButtonModule, FormsModule, PickListModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class RoleEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() rolId: number = 0;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();
  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  //cargo = new Cargo();
  rol = new Roles();
  rol2 = new Roles();
  cont = 0;
  pantallas2: any[] = [];
  pantallasList: any[] = [];
  files1: any[] = [];

  constructor(private messageService: MessageService) { }

  obtenerPantallasPorRol(): void {
    this.rol.role_Id = this.rolId;
  
   this.http.post<any[]>(`${this.apiUrl}/RolPorPantallas/Buscar`, this.rol)
      .subscribe((res: any) => {
        console.log('Pantallas asignadas al rol:', res);
        this.pantallas2 = res;

        this.files1 = this.pantallasList.filter(p =>
          !this.pantallas2.some((asignada: any) => asignada.pant_Id === p.pant_Id)
        );
      });
  }

  listaPantallas(): void {
    this.http.get(`${this.apiUrl}/Pantalla/Listar`)
      .subscribe((res: any) => {
        //console.log('Pantallas', res);
        this.pantallasList = res.map((pantalla: any) => ({
          ...pantalla
        }));
        this.files1 = this.pantallasList;
      });
  }

  EditarRol()  {
    console.log("Intentando guardar...");
    this.cont = 1;
    if(!this.rol.role_Descripcion.trim() || this.pantallas2.length == 0)
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia!',
        detail: 'Campos Vacios.'
      });
      return;
    }
    console.log("Intentando guardar... 2");
   


    this.rol.role_Id = this.rolId;
    this.rol.usua_Modificacion = 2;
    this.rol.role_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/Rol/Actualizar`, this.rol)
    .subscribe(() => {
      //this.actualizado.emit();
      this.rol2.role_Id = this.rolId;
      this.http.post(`${this.apiUrl}/RolP/Eliminar`, this.rol2 )
      .subscribe(() => {
       /* console.log("Intentando guardar... 3");
        console.log('Rol recibidas:', this.rol);
        console.log('Pantallas recibidas:', this.pantallas2);
        console.log('Pantallas asignadas:', this.pantallas2.length);*/
        if (this.pantallas2 && this.pantallas2.length > 0) {
  
          for (let pantalla of this.pantallas2) {
            const relacion = {
              pant_Id: pantalla.pant_Id,
              role_Id: this.rol2.role_Id,
              usua_Creacion: 2,
              roPa_FechaCreacion: new Date()
            };
    
            //console.log('Relacion a insertar:', relacion);
            //return;
            this.http.post(`${this.apiUrl}/RolPorPantallas/Insertar`,  relacion).subscribe();
          }
  
        }
        
      });
      this.actualizado.emit();
    });
  }

  ngOnInit(): void {
    this.cont = 0;
    this.listaPantallas();
    this.obtenerPantallasPorRol();

    this.rol.role_Id = this.rolId;
    this.http.post<Roles[]>(`${this.apiUrl}/Rol/Buscar`, this.rol)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.rol = data[0];
          console.log("Respuesta API:", data); 
         
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });

   
  }

}
