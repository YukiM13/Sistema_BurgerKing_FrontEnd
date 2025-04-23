import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import { Categoria } from '../../models/categorias.model'
import {CategoriaCreateComponent } from '../create/create.component';
import { CategoriaEditComponent } from '../edit/edit.component';
import { CategoriaDetailsComponent} from  '../details/details.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { Respuesta } from '../../models/respuesta.model'

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';



@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, CategoriaCreateComponent, CategoriaDetailsComponent, CategoriaEditComponent,RouterModule, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule,TableModule,InputTextModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  
})

export class CategoriasListComponent implements OnInit {

  private apiUrl = environment.apiUrl;


  showCreate = false;
  showDetails = false;
  showEdit = false;

  loading = [false, false, false, false];
  categoriaSeleccionado: any;
  categorias: any[] = [];
  categoria = new Categoria();


  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.http.get(`${this.apiUrl}/Categoria/Listar`)
      .subscribe((res: any) => {
        this.categorias = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }


  crearAcciones(categoria: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
          command: () => this.ObtenerCategoria(categoria.cate_Id, 1)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this.ObtenerCategoria(categoria.cate_Id, 2)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(categoria.cate_Id)
      }
    ];
  }

  
  ObtenerCategoria(id: number, accion:number): void {
    
    this.categoriaSeleccionado = id; // solo el ID
    if(accion == 1)
    {
      this.showEdit = true;
    }
    else
    {
      this.showDetails = true;
    }
    
}
  
  
    confirmarEliminacion(id: number): void {
      this.confirmationService.confirm({
        message: '¿Estás seguro que deseas eliminar esta categoria?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarCategoria(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  

   
  
    EliminarCategoria(id: number): void {
      this.categoria.cate_Id = id;
      this.http.post<Respuesta<Categoria>>(`${this.apiUrl}/Categoria/Eliminar`, this.categoria)
      .subscribe({
        next: (response) => {
        if (response && response.data.codeStatus >0) {
          console.log(response)
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Categoria eliminada'
          });
          this.listarCategorias();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo eliminar!',
            detail: 'La categoria esta siendo utilizado'
          });
          this.listarCategorias();
        }
      }
      });
    }
  


    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarCategorias();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listarCategorias();
    }

    cancelDetails(): void {
      this.showDetails = false;
      this.listarCategorias();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarCategorias();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Categoria creado exitosamente'
        });
      }, 100);
    }

    registroActualizado(): void {
      this.showEdit = false;
      this.listarCategorias();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'La categoria fue actualizada exitosamente'
        });
      }, 100);
    }

    crearError(): void {
      this.showCreate = false;
      this.listarCategorias();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'La categoria no se pudo crear'
        });
      }, 100);
    }



      onGlobalFilter(table: Table, event: Event) {
            table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
          }
}
