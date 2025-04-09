import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {EstadoCivil} from '../../models/estadosCiviles.model'
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EsCiEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() estadoCivilId: number = 0;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();
  cancelarFormulario() {
    this.cancelar.emit();  
  }
  http = inject(HttpClient);
  router = inject(Router);
  estadoCivilEntries:  any[] = [];
  estadosCivil = new EstadoCivil();
  estadoCivilAuxiliar = new EstadoCivil();
  descripcion = "";

  EditarEstadoCivil()  {
    this.estadoCivilAuxiliar.usua_Modificacion = 2;
    this.estadoCivilAuxiliar.esCi_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/EstadoCivil/Editar`, this.estadoCivilAuxiliar)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }
 // obtenerEstadoCivil(id: number) {
   // this.estadosCivil.esCi_Id = id;
    //this.http.post<EstadoCivil>(`${this.apiUrl}/EstadoCivil/Find`, this.estadosCivil)
      //.subscribe(data => {
        //this.estadoCivilAuxiliar = { ...data };
        //console.log('Estado Civil actualizado:', this.estadoCivilAuxiliar);
       
      //});
  //}
  ngOnInit(): void {
    this.estadosCivil.esCi_Id = this.estadoCivilId;
  
    this.http.post<EstadoCivil[]>(`${this.apiUrl}/EstadoCivil/Find`, this.estadosCivil)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.estadosCivil = data[0];
          console.log("Respuesta API:", data); 
          console.log("estadoCivilAuxiliar:", this.estadosCivil); 
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }
  
  

  
  
  
}
