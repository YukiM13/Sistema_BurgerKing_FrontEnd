import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {EstadoCivil} from '../../models/estadosCiviles.model'
import { environment } from 'src/enviroments/enviroment';
import { Respuesta } from 'src/app/models/respuesta.model';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class EsCiCreateComponent {
  private apiUrl = environment.apiUrl; 
  estadosCivil2: any[] = [];
  http = inject(HttpClient);
  cont = 0;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
  @Output() errorCrear = new EventEmitter<void>();

  ngOnInit(): void {
    this.cont = 0;
  }
  cancelarFormulario() {
    this.cancelar.emit();  
  }
  router = inject(Router)
  estadosCivil = new EstadoCivil();
  crearEstadoCivil()  {
    this.cont = 1;
    if(!this.estadosCivil.esci_Descripcion)
    {
      return;
    }
    this.estadosCivil.usua_Creacion = 2;
    const fecha = new Date();
    this.estadosCivil.esCi_FechaCreacion = fecha;  
    this.http.post<Respuesta<EstadoCivil>>(`${this.apiUrl}/EstadoCivil/Insertar`, this.estadosCivil)
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
  



