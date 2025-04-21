import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Productos } from '../../models/producto.model';
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { ProductoPorTamano } from 'src/app/models/productoPorTamano.model';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadModule, DropdownModule, MultiSelectModule, DialogModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class ProductoEditComponent {
  private apiUrl = environment.apiUrl;
  @Input() prodId: number = 0;
  @Output() cancelar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  http = inject(HttpClient);
  router = inject(Router);
  producto = new Productos();
  cont = 0;
  cont1 = 0;
  cont2 = 0;

  constructor(private messageService: MessageService) {}

  tamanoSeleccionado: number[] = [];
  preciosPorTamano: { [key: number]: number } = {};
  modalVisible: boolean = false;
  uploadedFiles: any[] = [];
  tamanosSeleccionadosConDescripcion: any[] = [];
  selectedFile: File | null = null;
  nombreOriginal: string = '';

  categorias: any[] = [];
  tamanos: any[] = [];

  cancelarFormulario() {
    this.cancelar.emit();
  }

  onUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    this.selectedFile = file;
    this.nombreOriginal = file.name;
    this.producto.prod_ImgUrl = 'assets/layout/imagenes/' + this.nombreOriginal;
    reader.onload = () => {};
  }

  uploadImage(): Observable<any> {
    this.cont2 = 1;
    const formData = new FormData();
    formData.append('imagen', this.selectedFile!);
    return this.http.post(`${this.apiUrl}/Producto/subirImagen`, formData);
  }

  removeImage() {
    this.producto.prod_ImgUrl = '';
    this.selectedFile = null;
    this.nombreOriginal = '';
  }

  onTamanoChange(event: any) {
    const seleccionados: number[] = event.value;
    this.tamanosSeleccionadosConDescripcion = this.tamanos.filter(t => seleccionados.includes(t.tama_Id));

    this.tamanosSeleccionadosConDescripcion.forEach(t => {
      if (this.preciosPorTamano[t.tama_Id] === undefined) {
        this.preciosPorTamano[t.tama_Id] = 0;
      }
    });

    this.modalVisible = this.tamanosSeleccionadosConDescripcion.length > 0;
  }

  guardarPrecios() {
    this.cont1 = 1;
    const preciosValidos = this.tamanosSeleccionadosConDescripcion.every(t => this.preciosPorTamano[t.tama_Id] > 0);

    if (!preciosValidos) return;

    this.modalVisible = false;
  }

  cancelarModal() {
    this.tamanosSeleccionadosConDescripcion.forEach(t => {
      delete this.preciosPorTamano[t.tama_Id];
    });
    this.modalVisible = false;
  }

  listarTamanos(): void {
    this.http.get<any[]>(`${this.apiUrl}/Tamano/Listar`)
      .subscribe({
        next: (response) => {
          this.tamanos = response;
          this.cargarTamanosYPreciosPorProducto(); // Ahora que ya cargamos los tamaños, obtenemos los seleccionados
        },
        error: () => {
          this.tamanos = [];
        }
      });
  }

  listarCategoria(): void {
    this.http.get<any[]>(`${this.apiUrl}/Categoria/Listar`)
      .subscribe({
        next: (response) => {
          this.categorias = response;
        },
        error: () => {
          this.categorias = [];
        }
      });
  }

  cargarTamanosYPreciosPorProducto() {
    this.http.post<ProductoPorTamano[]>(`${this.apiUrl}/Producto/ObtenerPreciosPorTamanos`, { prod_Id: this.prodId })
      .subscribe({
        next: (response) => {
          this.tamanoSeleccionado = response.map(r => r.tama_Id);
          this.preciosPorTamano = {};
          response.forEach(r => {
            this.preciosPorTamano[r.tama_Id] = r.prTa_Precio;
          });
          this.tamanosSeleccionadosConDescripcion = this.tamanos.filter(t => this.tamanoSeleccionado.includes(t.tama_Id));
        },
        error: (err) => {
          console.error("Error al cargar precios por tamaño", err);
        }
      });
  }

  EditarProducto() {
    this.cont = 1;
    this.cont1 = 1;
    this.cont2 = 1;

    if (!this.producto.prod_Descripcion.trim() || !this.producto.cate_Id || !this.producto.prod_ImgUrl) {
      this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Complete todos los campos requeridos' });
      return;
    }

    const preciosValidos = this.tamanosSeleccionadosConDescripcion.every(t => this.preciosPorTamano[t.tama_Id] > 0);
    if (!preciosValidos) {
      this.messageService.add({ severity: 'warn', summary: 'Precios inválidos', detail: 'Todos los tamaños deben tener un precio mayor a 0' });
      return;
    }

    type ProductoPorTamanoSimple = {
      prod_Id: number;
      tama_Id: number;
      prodTama_Precio: number;
    };
    

    const detallesPorTamano: ProductoPorTamanoSimple[] = this.tamanosSeleccionadosConDescripcion.map(t => ({
      prod_Id: this.producto.prod_Id,
      tama_Id: t.tama_Id,
      prodTama_Precio: this.preciosPorTamano[t.tama_Id]
    }));
    
    const data = {
      producto: this.producto,
      detallesPorTamano
    };

    const guardar = () => {
      this.http.put(`${this.apiUrl}/Producto/Actualizar`, data)
        .subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Editado', detail: 'Producto editado con éxito' });
            this.actualizado.emit();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo editar el producto' });
            console.error(err);
          }
        });
    };

    if (this.selectedFile) {
      this.uploadImage().subscribe({
        next: () => guardar(),
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Error al subir imagen', detail: 'No se pudo subir la imagen' });
          console.error(err);
        }
      });
    } else {
      guardar();
    }
  }

  ngOnInit(): void {
    this.producto.prod_Id = this.prodId;
    this.cont = 0;
    this.listarCategoria();
    this.listarTamanos();

    this.http.post<Productos[]>(`${this.apiUrl}/Prodcuto/Buscar`, { prod_Id: this.prodId })
      .subscribe(data => {
        if (data && data.length > 0) {
          this.producto = data[0];
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }
}
