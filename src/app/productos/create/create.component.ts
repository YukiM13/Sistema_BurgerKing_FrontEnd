import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Productos} from '../../models/producto.model'
import { environment } from 'src/enviroments/enviroment';
import { FileUploadModule } from 'primeng/fileupload';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule,FileUploadModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class ProduCreateComponent {
   private apiUrl = environment.apiUrl; 
    productos2: any[] = [];
    http = inject(HttpClient);
    @Output() cancelar = new EventEmitter<void>();  
    @Output() creado = new EventEmitter<void>();
    uploadedFiles: any[] = [];

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
  const formData = new FormData();
  formData.append('imagen', this.selectedFile!);
  return this.http.post(`https://localhost:7147/Producto/subirImagen`, formData);
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
    crearProducto()  {
      console.log('entro');
      this.producto.usua_Creacion = 2;
      const fecha = new Date();
      this.producto.prod_FechaCreacion = fecha;
      this.producto.cate_Id = 1
       

       this.uploadImage().subscribe({
        next: () => {
            this.http.post(`https://localhost:7147/Producto/Insertar`, this.producto)
        .subscribe(() => {
          this.creado.emit();
        });
        },
        error: (err: any) => console.error('Error al subir imagen:', err)
      })
      
      
      
    }
}
