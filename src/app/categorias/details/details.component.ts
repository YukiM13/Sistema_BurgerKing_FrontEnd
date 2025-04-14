import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Categoria } from '../../models/categorias.model'
import { environment } from 'src/enviroments/enviroment';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})

export class CategoriaDetailsComponent {
  private apiUrl = environment.apiUrl; 
  @Input() categoriaID: number = 0;
  @Output() cancelar = new EventEmitter<void>(); 

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  categoria = new Categoria();



  ngOnInit(): void {
    this.categoria.cate_Id = this.categoriaID;
  
    this.http.post<Categoria[]>(`${this.apiUrl}/Categoria/Find`, this.categoria)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.categoria = data[0];
          console.log("Respuesta API:", data);
          
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }
}
