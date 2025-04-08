import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Tamano} from '../../models/tamano.model'
import { environment } from 'src/enviroments/enviroment';



@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})



export class TamanoCreateComponent {
 private apiUrl = environment.apiUrl; 
  //estadosCivil2: any[] = [];
  
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
 

  cancelarFormulario() {
    this.cancelar.emit();  
  }
  router = inject(Router)
  tamano = new Tamano();

  crearTamano()  {
   
    this.tamano.usua_Creacion = 2;
    const fecha = new Date();
    this.tamano.tama_FechaCreacion = fecha;  
    this.http.post(`${this.apiUrl}/Tamano/Insertar`, this.tamano)
    .subscribe(() => {
      this.creado.emit();
    }

    );
    
    
  }
}