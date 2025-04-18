import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Tamano } from '../../models/tamano.model'
import { environment } from 'src/enviroments/enviroment';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class TamanoDetailsComponent {
  private apiUrl = environment.apiUrl; 
  @Input() tamaId: number = 0;
  @Output() cancelar = new EventEmitter<void>(); 

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  tamano = new Tamano();



  ngOnInit(): void {
    this.tamano.tama_Id = this.tamaId;
  
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
