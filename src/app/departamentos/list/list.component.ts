import { Component, inject, OnInit } from '@angular/core'; 
import {CommonModule, NgFor} from '@angular/common'; //trae operdaores de angular
import { RouterModule } from '@angular/router'; //Trae los link de las rutas del endpoint
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http'; //Trae el cliente http
import {Departamento } from '../../models/departamento.model'
import {DepaCreateComponent} from '../create/create.component';
//import {EsCiEditComponent} from '../edit/edit.component';
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
  //Falta el componente de editar
  //import {DepaEditComponent} from '../edit/edit.component';
  imports: [CommonModule, RouterModule, DepaCreateComponent, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule],
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

export class DepaListComponent implements OnInit {
  

  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];
  departamentoSeleccionado: any;
  departamentos: any[] = []; //inicializa el array de departamentos
  departamento = new Departamento();

  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listardepartamentos();
  }

  listardepartamentos(): void {
    this.http.get(`${this.apiUrl}/Departamento/Listar`)
      .subscribe((res: any) => {
        this.departamentos = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }

  crearAcciones(departamento: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.ObtenerDepartamento(departamento.depa_Codigo)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        // Puedes añadir lógica si se desea
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(departamento.depa_Codigo)
      }
    ];
  }

   ObtenerDepartamento(id: string): void {
      this.departamento.depa_Codigo = id;
      this.http.post<Departamento>(`${this.apiUrl}/Departamento/Find`, this.departamento)
        .subscribe(data => {
          this.departamentoSeleccionado = data;
          this.showEdit = true;
        });
    }
  
    confirmarEliminacion(id: string): void {
      this.confirmationService.confirm({
        message: '¿Estás seguro que deseas eliminar este Departamento?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarDepartamento(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }

    EliminarDepartamento(id: string): void {
      this.departamento.depa_Codigo = id;
      this.http.post(`${this.apiUrl}/Departamento/Eliminar`, this.departamento)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Departamento eliminado'
          });
          this.listardepartamentos();
        });
    }

    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listardepartamentos();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listardepartamentos();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listardepartamentos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Departamento creado exitosamente'
        });
      }, 100);
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

 
}
