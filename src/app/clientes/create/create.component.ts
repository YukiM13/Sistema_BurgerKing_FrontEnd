import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Cliente} from '../../models/clientes.model'
import { environment } from 'src/enviroments/enviroment';
import {ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleButtonModule, SelectButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})



export class ClienteCreateComponent implements OnInit {
  private apiUrl = environment.apiUrl; 
  //estadosCivil2: any[] = [];
  
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
 
  cont = 0;

  constructor(private messageService: MessageService) { }

  sexoOptions = [
    { label: 'Femenino', value: 'F' },
    { label: 'Masculino', value: 'M' }
  ];

  onSexoToggleChange(event: any) {
    console.log('Sexo seleccionado:', this.cliente.clie_Sexo);
  }

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  router = inject(Router)
  cliente = new Cliente();
  
  ngOnInit(): void {
    this.cliente.clie_Sexo = 'F'; 
    this.cont = 0;
  }
  

  crearCliente()  {
    
    //const sexo = this.cliente.clie_Sexo ? 'M' : 'F';
    //this.cliente.clie_Sexo = sexo;

    this.cont = 1;
    if(!this.cliente.clie_Nombre.trim() || !this.cliente.clie_Apellido.trim() || !this.cliente.clie_Sexo || !this.cliente.clie_Identidad_Rtn.trim())
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Campos Vacios.'
      });
      return;
    }

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

