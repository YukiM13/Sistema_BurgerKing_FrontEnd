import { Component, inject, OnInit } from '@angular/core'; 
import {CommonModule, NgFor} from '@angular/common'; //trae operdaores de angular
import { RouterModule } from '@angular/router'; //Trae los link de las rutas del endpoint
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http'; //Trae el cliente http
import {Departamento } from '../../models/departamento.model'
import {DepaCreateComponent} from '../create/create.component';
import {DepartamentoDetailsComponent} from '../details/details.component';
import { DepartamentoEditComponent } from '../edit/edit.component'; 
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Respuesta } from '../../models/respuesta.model'



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
  imports: [CommonModule, RouterModule, DepaCreateComponent, DepartamentoDetailsComponent, DepartamentoEditComponent,
     SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
 
})

export class DepaListComponent implements OnInit {
  

  private apiUrl = environment.apiUrl;

  showDetails = false;
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
        command: () => this.ObtenerDepartamento(departamento.depa_Codigo, 1)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this.ObtenerDepartamento(departamento.depa_Codigo, 2)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(departamento.depa_Codigo)
      }
    ];
  }

  ObtenerDepartamento(id: string, accion:number): void {
    
    this.departamentoSeleccionado = id; // solo el ID
    if(accion == 1)
    {
      this.showEdit = true;
    }
    else
    {
      this.showDetails = true;
    }
    
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
      this.http.post<Respuesta<Departamento>>(`${this.apiUrl}/Departamento/Eliminar`, this.departamento)
      .subscribe({
        next: (response) => {
        if (response && response.data.codeStatus >0) {
          console.log(response)
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Departamento eliminado'
          });
          this.listardepartamentos();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo eliminar!',
            detail: 'El departamento esta siendo utilizado'
          });
          this.listardepartamentos();
        }
      }
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

    cancelDetails(): void {
      this.showDetails = false;
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

    crearError(): void {
      this.showCreate = false;
      this.listardepartamentos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El departamento no se pudo crear'
        });
      }, 100);
    }

    registroActualizado(): void {
      this.showEdit = false;
      this.listardepartamentos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'El departamento fue actualizado exitosamente'
        });
      }, 100);
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

 
}
