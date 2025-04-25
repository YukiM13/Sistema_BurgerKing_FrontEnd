import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { environment } from 'src/enviroments/enviroment';
import { Productos } from 'src/app/models/producto.model';
import { Tamano } from 'src/app/models/tamano.model';
import { ProductoPorTamano } from 'src/app/models/productoPorTamano.model';
import { Respuesta } from 'src/app/models/respuesta.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    DropdownModule,
    MultiSelectModule,
    DialogModule,
    ToastModule
  ],
  providers: [MessageService],
   templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditarProductoComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  http = inject(HttpClient);
  router = inject(Router);

  @Input() prodId: number = 0;
 
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();
  cancelarFormulario() {
    this.cancelar.emit();  
  }

  producto = new Productos();
  producto2 = new Productos();
  producto3 = new Productos();
  productoPorTamano = new ProductoPorTamano();

  categorias: any[] = [];
  tamanos: any[] = [];
  tamanosSeleccionadosConDescripcion: any[] = [];
  preciosPorTamano: { [key: number]: number } = {};
  prTama:{ [key: number]: number } = {};
  modalVisible = false;
  url =  this.apiUrl;

  selectedFile: File | null = null;
  nombreOriginal = '';

  cont = 0;
  cont1 = 0;
  cont2 = 0;

  
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.resetForm(); 
    this.listarCategoria();
    this.listarTamanos();
    this.obtenerProducto();
    this.obtenerPreciosPorTamano();

  }

  seleccionado: {
    prta_Id: number;
    cantidad:number;
   
  }[] = [];

  tamanosOriginales: number[] = [];

  obtenerPreciosPorTamano() {
    
    this.producto3.prod_Id = this.prodId;

    this.http.post<ProductoPorTamano[]>(`${this.apiUrl}/ProductoPorTamano/FindPrTa`, this.producto3).subscribe({
      next: (res) => {
        console.log("Respuesta API:", res);
        res.forEach(item => {
          this.preciosPorTamano[item.tama_Id] = item.prTa_Precio;
          this.prTama[item.tama_Id] = item.prTa_Id;
        });

        //console.log(this.prTama);
  
        this.tamanosSeleccionados = res.map(p => p.tama_Id);
        this.tamanosOriginales = [...this.tamanosSeleccionados];
        this.tamanosSeleccionadosConDescripcion = this.tamanos.filter(t => this.tamanosSeleccionados.includes(t.tama_Id));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los precios por tamaño.'
        });
      }
    });
  }

  eliminarTamanosDeseleccionados() {
    const tamanosEliminados = this.tamanosOriginales.filter(
      original => !this.tamanosSeleccionados.includes(original)
    );
  
    for (const tamaId of tamanosEliminados) {
      const prTa_Id = this.prTama[tamaId]; // 👈 Este es el ID real de la relación Producto-Tamaño
      console.log('Tamaños eliminados detectados:', tamanosEliminados);
      console.log(' detectados:', prTa_Id);
      this.http.post<Respuesta<ProductoPorTamano>>(`${this.apiUrl}/ProductoPorTamano/Eliminar`, { prTa_Id: prTa_Id })
        .subscribe({
          next: (response) => {
            console.log('res', response);
            if (response && response.data.codeStatus >0) {
              this.messageService.add({
                
                severity: 'success',
                summary: 'Tamaño eliminado',
                detail: 'El tamaño fue eliminado correctamente.'
              });
            } else {
              console.log('Entro al else');
              // Restaurar el tamaño si no se pudo eliminar
              if (!this.tamanosSeleccionados.includes(tamaId)) {
                this.tamanosSeleccionados.push(tamaId);
              }
  
              this.tamanosSeleccionadosConDescripcion = this.tamanos.filter(t =>
                this.tamanosSeleccionados.includes(t.tama_Id)
              );
  
              this.messageService.add({
                
                severity: 'warn',
                summary: 'No se puede eliminar',
                detail: 'Este tamaño está en uso y no puede eliminarse.'
              });

              console.log('Entro al else2222222');
              return;
            }
          },
          error: () => {
            if (!this.tamanosSeleccionados.includes(tamaId)) {
              this.tamanosSeleccionados.push(tamaId);
            }
  
            this.tamanosSeleccionadosConDescripcion = this.tamanos.filter(t =>
              this.tamanosSeleccionados.includes(t.tama_Id)
            );
  
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al intentar eliminar el tamaño.'
            });
          }
        });
    }
  }
  
  
  
  
  
  
  actualizarOInsertarPreciosPorTamano() {
    const fecha = new Date();
  
    for (const tamaIdStr of Object.keys(this.preciosPorTamano)) {
      const tamaId = +tamaIdStr;
      const precio = this.preciosPorTamano[tamaId];
  
      const prTa_IdExistente = this.prTama[tamaId];
  
      const productoPorTamano = new ProductoPorTamano();
      productoPorTamano.prod_Id = this.producto.prod_Id!;
      productoPorTamano.tama_Id = tamaId;
      productoPorTamano.prTa_Precio = precio;
  
      if (prTa_IdExistente) {
        // Ya existe, actualizar
        productoPorTamano.prTa_Id = +prTa_IdExistente;
        productoPorTamano.usua_Modificacion = Number(localStorage.getItem('usuario_id'));
        productoPorTamano.prTa_FechaModificacion = fecha;
  
        this.http.put(`https://localhost:7147/ProductoPorTamano/Actualizar`, productoPorTamano).subscribe({
          next: () => console.log("Actualizado:", productoPorTamano),
          error: err => console.error("Error al actualizar:", err)
        });
      } else {
        // No existe, insertar
        productoPorTamano.usua_Creacion = Number(localStorage.getItem('usuario_id'));
        productoPorTamano.prTa_FechaCreacion = fecha;
  
        this.http.post(`https://localhost:7147/ProductoPorTamano/Insertar`, productoPorTamano).subscribe({
          next: () => console.log("Insertado:", productoPorTamano),
          error: err => console.error("Error al insertar:", err)
        });
      }
    }
  }
  
  

  obtenerProducto() {
    this.producto.prod_Id = this.prodId;
    this.http.post<Productos[]>(`${this.apiUrl}/Prodcuto/Buscar`, this.producto).subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.producto = res[0];
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Producto no encontrado'
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener el producto'
        });
      }
    });
  }

  resetForm() {
    this.producto = new Productos();
    this.producto2 = new Productos();
    this.producto3 = new Productos();
    this.productoPorTamano = new ProductoPorTamano();
    this.tamanosSeleccionados = [];
    this.tamanosSeleccionadosConDescripcion = [];
    this.preciosPorTamano = {};
    this.selectedFile = null;
    this.nombreOriginal = '';
  }

  editarProducto() {
    this.cont = 1;
    this.cont1 = 1;
    this.cont2 = 1;
  
    if (!this.producto.prod_Descripcion?.trim() || !this.producto.cate_Id || 
        this.tamanosSeleccionados.length === 0 || 
        !this.producto.prod_ImgUrl) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos obligatorios'
      });
      return;
    }
  
    this.producto.prod_Id = this.prodId;
    this.producto.usua_Modificacion = Number(localStorage.getItem('usuario_id'));
    this.producto.prod_FechaModificacion = new Date();
    this.producto2.prod_Id = this.prodId;
  
    this.uploadImage().then(() => {
      this.http.put(`${this.apiUrl}/Producto/Actualizar`, this.producto)
        .subscribe({
          next: () => {
            this.actualizarOInsertarPreciosPorTamano();
            //this.eliminarTamanosDeseleccionados(); 
            this.actualizado.emit();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al actualizar el producto'
            });
          }
        });
    });
  }
  

  uploadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) return resolve();

      const formData = new FormData();
      formData.append('imagen', this.selectedFile);
      this.http.post(`${this.apiUrl}/Producto/subirImagen`, formData).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }

  onUpload(event: any) {
    const file = event.files[0];
    this.selectedFile = file;
    this.nombreOriginal = file.name;
    this.producto.prod_ImgUrl = 'assets/layout/imagenes/' + this.nombreOriginal;
  }

  tamanosSeleccionados: number[] = [];

  onTamanoChange(event: any) {
    const nuevosSeleccionados = [...event.value];
    const tamanosEliminados = this.tamanosSeleccionados.filter(id => !nuevosSeleccionados.includes(id));
    const nuevosAgregados = nuevosSeleccionados.filter(id => !this.tamanosSeleccionados.includes(id));
  
    // Procesar eliminados de forma segura
    const eliminacionesPendientes = [...tamanosEliminados];
  
    eliminacionesPendientes.forEach(tamaId => {
      const prTa_Id = this.prTama[tamaId];
  
      this.http.post<Respuesta<ProductoPorTamano>>(`${this.apiUrl}/ProductoPorTamano/Eliminar`, { prTa_Id: prTa_Id })
        .subscribe({
          next: (response) => {
            if (response && response.data.codeStatus > 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Tamaño eliminado',
                detail: 'El tamaño fue eliminado correctamente.'
              });
  
              // ✅ Eliminar de los seleccionados sólo si fue exitoso
              this.tamanosSeleccionados = this.tamanosSeleccionados.filter(id => id !== tamaId);
              delete this.preciosPorTamano[tamaId];
              delete this.prTama[tamaId];
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'No se puede eliminar',
                detail: 'Este tamaño está en uso y no puede eliminarse.'
              });
            }
  
          this.actualizarVistaDeTamanos();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al intentar eliminar el tamaño.'
            });
  
          this.actualizarVistaDeTamanos();
          }
        });
    });
  
    // Agregar nuevos seleccionados
    nuevosAgregados.forEach(id => {
      if (!this.tamanosSeleccionados.includes(id)) {
        this.tamanosSeleccionados.push(id);
      }
  
      if (this.preciosPorTamano[id] === undefined) {
        this.preciosPorTamano[id] = 0;
      }
    });
  
   this.actualizarVistaDeTamanos();
  }
  
  actualizarVistaDeTamanos() {
    this.tamanosSeleccionadosConDescripcion = this.tamanos.filter(t =>
      this.tamanosSeleccionados.includes(t.tama_Id)
    );
  
    this.modalVisible = this.tamanosSeleccionadosConDescripcion.length > 0;
  }
  
  
  

  guardarPrecios() {
    const validos = this.tamanosSeleccionadosConDescripcion.every(t => this.preciosPorTamano[t.tama_Id] > 0);
    if (!validos) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe ingresar precios válidos'
      });
      return;
    }
    this.modalVisible = false;
  }

  cancelarModal() {
   
    this.tamanosSeleccionados.forEach(id => {
      delete this.preciosPorTamano[id];
    });
  
   
    this.tamanosSeleccionados = [];
    this.tamanosSeleccionadosConDescripcion = [];
  
   
    this.modalVisible = false;
  }
  

 

  removeImage() {
    this.producto.prod_ImgUrl = '';
    this.selectedFile = null;
    this.nombreOriginal = '';
  }

  listarCategoria() {
    this.http.get<any[]>(`${this.apiUrl}/Categoria/Listar`).subscribe({
      next: res => this.categorias = res,
      error: () => this.categorias = []
    });
  }

  listarTamanos() {
    this.http.get<any[]>(`${this.apiUrl}/Tamano/Listar`).subscribe({
      next: res => this.tamanos = res,
      error: () => this.tamanos = []
    });
  }
}
