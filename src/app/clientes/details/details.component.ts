import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Cliente } from '../../models/clientes.model'
import { environment } from 'src/enviroments/enviroment';
import { Table, TableModule } from 'primeng/table';
import { ClienteEditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class ClienteDetailsComponent {
  private apiUrl = environment.apiUrl; 
  @Input() clienteId: number = 0;
  @Output() cancelar = new EventEmitter<void>(); 

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  cliente = new Cliente();



  ngOnInit(): void {
    this.cliente.clie_Id = this.clienteId;
  
    this.http.post<Cliente[]>(`${this.apiUrl}/Cliente/Buscar`, this.cliente)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.cliente = data[0];
          console.log("Respuesta API:", data);
          
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }
}
