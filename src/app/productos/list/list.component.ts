import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {Productos} from '../../models/producto.model'
import {ProduCreateComponent} from '../../productos/create/create.component';
 import {EditarProductoComponent} from '../../productos/edit/edit.component';
import {ProductoDetailsComponent} from '../../productos/details/details.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Respuesta } from 'src/app/models/respuesta.model';



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
  imports: [CommonModule, RouterModule,ProduCreateComponent, ProductoDetailsComponent, EditarProductoComponent,
     SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('collapse', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        
      ]),
      transition(':leave', [
         style({ height: '0px', opacity: 0 })
      ])
    ])
  ]
 
})
export class ProduListComponent {
  private apiUrl = environment.apiUrl;
  
  
    showCreate = false;
    showEdit = false;
    showDetails = false;
    loading = [false, false, false, false];
    productoSeleccionado: any;
    Productos: any[] = [];
    producto = new Productos();
    url =  this.apiUrl;
  
    private http = inject(HttpClient);
    private router = inject(Router);
    constructor(
      private confirmationService: ConfirmationService,
      private messageService: MessageService
    ) {}
  
    ngOnInit(): void {
      this.listarProductos();
    }
  
  
    listarProductos(): void {
      this.http.get(`${this.apiUrl}/Producto/Listar`)
        .subscribe((res: any) => {
          this.Productos = res.map((estado: any) => ({
            ...estado,
            acciones: this.crearAcciones(estado)
            
          }));
        });
    }
  
  
    crearAcciones(producto: any): MenuItem[] {
      return [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => this.ObtenerProducto(producto.prod_Id , 1)
        },
        {
          label: 'Detalles',
          icon: 'pi pi-eye',
          command: () => this.ObtenerProducto(producto.prod_Id , 2)
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: () => this.confirmarEliminacion(producto.prod_Id)
        }
      ];
    }
  
  
    ObtenerProducto(id: number, accion:number): void {
    
      this.productoSeleccionado = id; 
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
        message: '¿Estás seguro que deseas eliminar este producto?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarProducto(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  
  
    EliminarProducto(id: number): void {
      this.producto.prod_Id = id;
      this.http.post<Respuesta<Productos>>(`${this.apiUrl}/producto/Eliminar`, this.producto)
      .subscribe({
        next: (response) => {
        if (response && response.data.codeStatus >0) {
          console.log(response)
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Producto eliminado'
          });
          this.listarProductos();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo eliminar!',
            detail: 'Algo paso!'
          });
          this.listarProductos();
        }
      }
      });
    }
  
    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarProductos();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listarProductos();
    }
  
    cancelDetails(): void {
      this.showDetails = false;
      this.listarProductos();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarProductos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Producto creado exitosamente'
        });
      }, 100);
    }

    crearError(): void {
      this.showCreate = false;
      this.listarProductos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El producto no se pudo crear'
        });
      }, 100);
    }

    registroActualizado(): void {
      this.showEdit = false;
      this.listarProductos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'El producto fue actualizado exitosamente'
        });
      }, 100);
    }
}
