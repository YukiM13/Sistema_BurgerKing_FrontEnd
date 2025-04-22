import {Component,EventEmitter,inject,OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Departamento } from 'src/app/models/departamento.model';
import { ButtonModule } from 'primeng/button';
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Respuesta } from '../../models/respuesta.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ButtonModule,FormsModule, ToastModule],
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

  router = inject(Router); 
  departamento = new Departamento(); 

  limpiarEspacioInicial() {
    if (this.departamento.depa_Codigo) {
      this.departamento.depa_Codigo = this.departamento.depa_Codigo.replace(/^\s+/, '');
    }
  }

  validarCodigoKey(event: KeyboardEvent) {
    const tecla = event.key;

    const teclasPermitidas = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (teclasPermitidas.includes(tecla)) {
      return;
    }

    const esNumero = /^[0-9]$/.test(tecla);
    const codigoActual = this.departamento.depa_Codigo ?? '';
  
    if (!esNumero || codigoActual.length >= 2) {
      event.preventDefault(); 
    }
  }
  
  limitarCodigo() {
    if (this.departamento.depa_Codigo?.length > 2) {
      this.departamento.depa_Codigo = this.departamento.depa_Codigo.slice(0, 2);
    }
  
    
    this.departamento.depa_Codigo = this.departamento.depa_Codigo.replace(/[^0-9]/g, '');
  }
  




  crearDepartamento() {
    this.cont = 1;
       if (
      !this.departamento.depa_Codigo.trim() ||
      !/^\d{2}$/.test(this.departamento.depa_Codigo) || 
      !this.departamento.depa_Descripcion.trim()
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Código inválido o campos vacíos.'
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
