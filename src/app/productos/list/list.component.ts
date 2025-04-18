import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {Productos} from '../../models/producto.model'
import {ProduCreateComponent} from '../../productos/create/create.component';
// import {MuniEditComponent} from '../../Productos/edit/edit.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';



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
  imports: [CommonModule, RouterModule,ProduCreateComponent, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule],
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
export class ProduListComponent {
  private apiUrl = environment.apiUrl;
  
  
    showCreate = false;
    showEdit = false;
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
          command: () => this.ObtenerProducto(producto.prod_Id)
        },
        {
          label: 'Detalles',
          icon: 'pi pi-eye',
          // Puedes añadir lógica si se desea
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: () => this.confirmarEliminacion(producto.prod_Id)
        }
      ];
    }
  
  
    ObtenerProducto(id: number): void {
      this.producto.prod_Id = id;
      this.http.post<Productos>(`${this.apiUrl}/producto/Find`, this.producto)
        .subscribe(data => {
          this.productoSeleccionado = data;
          this.showEdit = true;
        });
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
      this.http.post(`${this.apiUrl}/producto/Eliminar`, this.producto)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Producto eliminado'
          });
          this.listarProductos();
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
}
