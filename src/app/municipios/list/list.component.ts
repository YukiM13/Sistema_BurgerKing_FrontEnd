import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {Municipios} from '../../models/municipio.model'
// import {MuniCreateComponent} from '../../municipios/create/create.component';
// import {MuniEditComponent} from '../../municipios/edit/edit.component';
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
  imports: [CommonModule, RouterModule, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule],
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
export class MuniListComponent  implements OnInit {

  private apiUrl = environment.apiUrl;
  
  
    showCreate = false;
    showEdit = false;
    loading = [false, false, false, false];
    municipioSeleccionado: any;
    municipios: any[] = [];
    municipio = new Municipios();
  
  
    private http = inject(HttpClient);
    private router = inject(Router);
    constructor(
      private confirmationService: ConfirmationService,
      private messageService: MessageService
    ) {}
  
    ngOnInit(): void {
      this.listarMunicipios();
    }
  
  
    listarMunicipios(): void {
      this.http.get(`${this.apiUrl}/Municipio/Listar`)
        .subscribe((res: any) => {
          this.municipios = res.map((estado: any) => ({
            ...estado,
            acciones: this.crearAcciones(estado)
          }));
        });
    }
  
  
    crearAcciones(municipio: any): MenuItem[] {
      return [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => this.ObtenerMunicipio(municipio.muni_Codigo)
        },
        {
          label: 'Detalles',
          icon: 'pi pi-eye',
          // Puedes añadir lógica si se desea
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: () => this.confirmarEliminacion(municipio.muni_Codigo)
        }
      ];
    }
  
  
    ObtenerMunicipio(id: string): void {
      this.municipio.muni_Codigo = id;
      
      this.http.post<Municipios>(`${this.apiUrl}/Municipio/Find`, this.municipio)
        .subscribe(data => {
          this.municipioSeleccionado = data;
          this.showEdit = true;
        });
    }
  
  
    confirmarEliminacion(id: string): void {
      this.confirmationService.confirm({
        message: '¿Estás seguro que deseas eliminar este municipio?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarMunicipio(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  
  
    EliminarMunicipio(id: string): void {
      this.municipio.muni_Codigo = id;
      this.http.post(`${this.apiUrl}/municipio/Eliminar`, this.municipio)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Municipio eliminado'
          });
          this.listarMunicipios();
        });
    }
  
    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarMunicipios();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listarMunicipios();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarMunicipios();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Municipio creado exitosamente'
        });
      }, 100);
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
