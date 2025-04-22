import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Tamano } from '../../models/tamano.model'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ButtonModule,FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class TamanoEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() tamaId: number = 0;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();
  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  tamano = new Tamano();
  cont = 0;

  constructor(private messageService: MessageService) { }

  EditarTamano()  {
    this.cont = 1;
    if(!this.tamano.tama_Descripcion.trim())
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia!',
        detail: 'Campos Vacios.'
      });
      return;
    }

    this.tamano.usua_Modificacion = 2;
    this.tamano.tama_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/Tamano/Editar`, this.tamano)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }

  ngOnInit(): void {
    this.tamano.tama_Id = this.tamaId;
    this.cont = 0;
    this.http.post<Tamano[]>(`${this.apiUrl}/Tamano/Find`, this.tamano)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.tamano = data[0];
          console.log("Respuesta API:", data); 
         
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }

}
