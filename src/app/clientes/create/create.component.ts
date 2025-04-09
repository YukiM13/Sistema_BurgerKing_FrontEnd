import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Cliente} from '../../models/clientes.model'
import { environment } from 'src/enviroments/enviroment';
import {ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleButtonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})


export class ClienteCreateComponent {
  private apiUrl = environment.apiUrl; 
  //estadosCivil2: any[] = [];
  
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
 

  onSexoToggleChange(event: any) {
    console.log('Sexo seleccionado:', this.cliente.clie_Sexo);
  }

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  router = inject(Router)
  cliente = new Cliente();

  crearCliente()  {
    const sexo = this.cliente.clie_Sexo ? 'M' : 'F';
    this.cliente.clie_Sexo = sexo;

    this.cliente.usua_Creacion = 2;
    const fecha = new Date();
    this.cliente.clie_FechaCreacion = fecha;  
    this.http.post(`${this.apiUrl}/Cliente/Insertar`, this.cliente)
    .subscribe(() => {
      this.creado.emit();
    }

    );
    
    
    
  }
}

