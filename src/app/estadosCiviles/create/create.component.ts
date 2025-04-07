import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {EstadoCivil} from '../../models/estadosCiviles.model'
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class EsCiCreateComponent {
  private apiUrl = environment.apiUrl; 
  estadosCivil2: any[] = [];
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
 

  cancelarFormulario() {
    this.cancelar.emit();  
  }
  router = inject(Router)
  estadosCivil = new EstadoCivil();
  crearEstadoCivil()  {
    this.estadosCivil.usua_Creacion = 2;
    const fecha = new Date();
    this.estadosCivil.esCi_FechaCreacion = fecha;  
    this.http.post(`${this.apiUrl}/EstadoCivil/Insertar`, this.estadosCivil)
    .subscribe(() => {
      this.creado.emit();
    }

    );
    
    
    
  }

}
  

