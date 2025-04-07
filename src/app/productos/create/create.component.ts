import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Productos} from '../../models/producto.model'
import { environment } from 'src/enviroments/enviroment';
import { FileUploadModule } from 'primeng/fileupload';

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


    onUpload(event: any) {
      const file = event.files[0];
      const reader = new FileReader();
    
      reader.onload = (e: any) => {
        this.producto.prod_ImgUrl = e.target.result; // Aquí se guarda como base64 string
      };
    
      reader.readAsDataURL(file);
    }

    removeImage() {
      this.producto.prod_ImgUrl = '';
    }
    cancelarFormulario() {
      this.cancelar.emit();  
    }
    router = inject(Router)
    producto = new Productos();
    crearProducto()  {
      this.producto.usua_Creacion = 2;
      const fecha = new Date();
      this.producto.prod_FechaCreacion = fecha;  
      this.http.post(`${this.apiUrl}/EstadoCivil/Insertar`, this.producto)
      .subscribe(() => {
        this.creado.emit();
      }
  
      );
      
      
      
    }
}
