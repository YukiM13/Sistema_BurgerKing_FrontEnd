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
  productoPorTamano = new ProductoPorTamano();

  categorias: any[] = [];
  tamanos: any[] = [];
  tamanosSeleccionadosConDescripcion: any[] = [];
  preciosPorTamano: { [key: number]: number } = {};
  modalVisible = false;
  url =  this.apiUrl;

  selectedFile: File | null = null;
  nombreOriginal = '';

  cont = 0;
  cont1 = 0;
  cont2 = 0;

  
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.listarCategoria();
    this.listarTamanos();
    this.obtenerProducto();
    this.obtenerPreciosPorTamano();

  }

  obtenerPreciosPorTamano() {
    
    this.producto2.prod_Id = this.prodId;

    this.http.post<ProductoPorTamano[]>(`${this.apiUrl}/ProductoPorTamano/FindPrTa`, this.producto2).subscribe({
      next: (res) => {
        //console.log("Respuesta API:", res);
        res.forEach(item => {
          this.preciosPorTamano[item.tama_Id] = item.prTa_Precio;
        });
  
        this.tamanosSeleccionados = res.map(p => p.tama_Id);
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
    this.producto.usua_Modificacion = 2;
    this.producto.prod_FechaModificacion = new Date();
    this.producto2.prod_Id = this.prodId;
    this.uploadImage().then(() => {
      this.http.put(`${this.apiUrl}/Producto/Actualizar`, this.producto)
      .subscribe({
        next: () => {

        this.http.post(`${this.apiUrl}/ProductoPorTamano/Eliminar`, this.producto2 )
        .subscribe(() => { 


          const fecha = new Date();
          //this.productoPorTamano.usua_Modificacion = 2;
          //this.productoPorTamano.prTa_FechaModificacion = fecha;

          console.log("Precios por tamaño a insertar:", this.preciosPorTamano);
          for (const id in this.preciosPorTamano) {
            const precio = this.preciosPorTamano[+id];
            if (precio > 0) {
              const nuevoProductoPorTamano = new ProductoPorTamano();
              nuevoProductoPorTamano.prod_Id = this.producto.prod_Id!;
              nuevoProductoPorTamano.tama_Id = +id;
              nuevoProductoPorTamano.prTa_Precio = precio;
              nuevoProductoPorTamano.usua_Creacion = 2;
              nuevoProductoPorTamano.prTa_FechaCreacion = new Date();
          
              //console.log(nuevoProductoPorTamano);
              console.log("Insertando:", nuevoProductoPorTamano);
              this.http.post(`${this.apiUrl}/ProductoPorTamano/Insertar`, nuevoProductoPorTamano).subscribe({
                next: () => {
                  console.log("Insertado correctamente", nuevoProductoPorTamano);
                },
                error: (err) => {
                  console.error("Error al insertar ProductoPorTamano:", err);
                }
              });
            }
          }
          
          //return;

        });
       
          this.actualizado.emit();
        },
       
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
    const seleccionados = event.value;
    this.tamanosSeleccionadosConDescripcion = this.tamanos.filter(t => seleccionados.includes(t.tama_Id));
    this.tamanosSeleccionadosConDescripcion.forEach(t => {
      if (!this.preciosPorTamano[t.tama_Id]) {
        this.preciosPorTamano[t.tama_Id] = 0;
      }
    });
    this.modalVisible = true;
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
    this.tamanosSeleccionadosConDescripcion.forEach(t => delete this.preciosPorTamano[t.tama_Id]);
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
