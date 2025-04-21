import {Component,EventEmitter,inject,OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Departamento } from 'src/app/models/departamento.model';

import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Respuesta } from '../../models/respuesta.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class DepaCreateComponent {
  private apiUrl = environment.apiUrl; 
  departamento2: any[] = [];
  http = inject(HttpClient); //inicializa el cliente http
 
  constructor(private messageService: MessageService) { }

  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
  @Output() errorCrear = new EventEmitter<void>();
  cont = 0;

  ngOnInit(): void {
    this.cont = 0;
  }


  cancelarFormulario() {
    this.cancelar.emit();  
  }

  router = inject(Router); //inicializa el router
  departamento = new Departamento(); //inicializa el objeto departamento

  limpiarEspacioInicial() {
    if (this.departamento.depa_Codigo) {
      this.departamento.depa_Codigo = this.departamento.depa_Codigo.replace(/^\s+/, '');
    }
  }

  filtrarCodigo(event: any) {
    let valor = event.target.value;
  
    // Solo mantener números
    valor = valor.replace(/[^0-9]/g, '');
  
    // Limitar a 2 dígitos
    if (valor.length > 2) {
      valor = valor.slice(0, 2);
    }
  
    this.departamento.depa_Codigo = valor;
  }
  


  crearDepartamento() {
    this.cont = 1;
        if(!this.departamento.depa_Codigo.trim()  || !this.departamento.depa_Descripcion.trim() ) 
        {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'Campos Vacios.'
          });
          return;
        }

    this.departamento.usua_Creacion = 2;
    const fecha = new Date();
    fecha.toLocaleDateString;
    this.departamento.depa_FechaCreacion = new Date(); 

    this.http.post<Respuesta<Departamento>>(`${this.apiUrl}/Departamento/Insertar`, this.departamento)
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
