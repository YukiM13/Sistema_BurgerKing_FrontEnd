import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Productos} from '../../models/producto.model'
import { environment } from 'src/enviroments/enviroment';
import { FileUploadModule } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { Respuesta } from 'src/app/models/respuesta.model';
import { Tamano } from 'src/app/models/tamano.model';
import { ProductoPorTamano } from 'src/app/models/productoPorTamano.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadModule, DropdownModule,MultiSelectModule,DialogModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class ProduCreateComponent {
   private apiUrl = environment.apiUrl; 
    productos2: any[] = [];
    http = inject(HttpClient);
    @Output() cancelar = new EventEmitter<void>();  
    @Output() creado = new EventEmitter<void>();
    @Output() errorCrear = new EventEmitter<void>();
    uploadedFiles: any[] = [];

  cont = 0;
  cont1 = 0;
  cont2 = 0;
    showRemove: boolean = false;

    selectedFile: File | null = null;
    nombreOriginal: string = '';
onUpload(event: any) {
  console.log('entro');
  const file = event.files[0];
  const reader = new FileReader();
  this.selectedFile = file;
  this.nombreOriginal = file.name;
  console.log('verificacion asginacion',this.selectedFile);
  this.producto.prod_ImgUrl = 'assets/layout/imagenes/' + this.nombreOriginal;
console.log(file.name);
  reader.onload = (e: any) => {
    console.log('Imagen cargada:', e.target.result);

  };
};

uploadImage(): Observable<any> {
  this.cont2 = 1;
  const formData = new FormData();
  formData.append('imagen', this.selectedFile!);
  return this.http.post(`${this.apiUrl}/Producto/subirImagen`, formData);
}

tamanoSeleccionado: number[] = [];
preciosPorTamano: { [key: number]: number } = {}; 
modalVisible: boolean = false;


tamanosSeleccionadosConDescripcion: any[] = [];
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
  console.log("Antes:", this.preciosPorTamano);
  const preciosValidos = this.tamanosSeleccionadosConDescripcion.every(t => this.preciosPorTamano[t.tama_Id] > 0);

  if (!preciosValidos) {
    
    return;
  }

  console.log('Precios guardados:', this.preciosPorTamano);
  this.modalVisible = false;
}

cancelarModal() {
  
  this.tamanosSeleccionadosConDescripcion.forEach(t => {
    delete this.preciosPorTamano[t.tama_Id];
  });

  this.modalVisible = false;
}
    
  removeImage() {
    this.producto.prod_ImgUrl = '';
    this.selectedFile = null;
    this.nombreOriginal = '';
  }
    cancelarFormulario() {
      this.cancelar.emit();  
    }

    router = inject(Router)
    producto = new Productos();
    tamano = new Tamano();
    productoPorTamano = new ProductoPorTamano();
    //productoAux = new Productos();

    crearProducto()  {
      this.cont = 1;
      console.log('entro');
      console.log(this.tamano.tama_Id);
      this.producto.usua_Creacion = 2;
      const fecha = new Date();
      this.producto.prod_FechaCreacion = fecha;
      //this.producto.cate_Id = 2
       
     
       this.uploadImage().subscribe({
        next: () => {
          if(!(this.producto.prod_ImgUrl && this.producto.prod_Descripcion.trim() && this.producto.cate_Id)) {
            return
          }
          
            this.http.post(`${this.apiUrl}/Producto/Insertar`, this.producto)
        .subscribe( data => {
          if (data && Array.isArray(data) && data.length > 0) {
            const producto1 = data[0] as any; 
            this.productoPorTamano.prod_Id = producto1.prod_Id;
          }
    

        this.productoPorTamano.usua_Creacion = 2;
        this.productoPorTamano.prTa_FechaCreacion = fecha;
        for (let clave in this.preciosPorTamano) {
          if (this.preciosPorTamano.hasOwnProperty(clave)) {
            let valor = this.preciosPorTamano[clave];
            this.productoPorTamano.tama_Id = Number(clave);
            this.productoPorTamano.prTa_Precio = valor;
            console.log(this.productoPorTamano);
            if(!(this.productoPorTamano.tama_Id && this.productoPorTamano.prTa_Precio && this.productoPorTamano.prod_Id)) {
              return

            }
            this.http.post<Respuesta<ProductoPorTamano>>(`${this.apiUrl}/ProductoPorTamano/Insertar`, this.productoPorTamano)
            .subscribe({
              next: (response) => {
              if (response && response.data.codeStatus >0) {
                console.log(response)
                this.creado.emit();
              } else {
                this.errorCrear.emit();
              }
            }
            });
          }
        }
        });
      
        },
        error: (err: any) => console.error('Error al subir imagen:', err)
      })
      
      
      
    }

    ngOnInit(): void {
      this.cont = 0;
      this.cont1 = 0;
      this.cont2 = 0;
      this.listarCategoria();
      this.listarTamanos();
    }
    
   
    
  //prueba: any[] = [];
    categorias: any[] = [];
    tamanos: any[] = [];

    //municipos = new Municipios();
    listarTamanos(): void {
      this.http.get<any[]>(`${this.apiUrl}/Tamano/Listar`)
      .subscribe({
        next: (response) => {
            
          this.tamanos = response;
           
           console.log(this.tamanos);
           
         },
         error: (error) => {
          
           this.tamanos = [];
         }
      })
    }
    listarCategoria(): void {
      this.http.get<any[]>(`${this.apiUrl}/Categoria/Listar`)
        .subscribe({
          next: (response) => {
            
           this.categorias = response;
            
            console.log(this.categorias);
            
          },
          error: (error) => {
           
            this.categorias = [];
          }
        });
    }
}
