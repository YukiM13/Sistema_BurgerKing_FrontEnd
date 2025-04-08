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
export class EsCiEditComponent implements OnInit{
  private apiUrl = environment.apiUrl; 
  @Input() estadoCivilId: number = 0;
  @Output() cancelar = new EventEmitter<void>();  
  cancelarFormulario() {
    this.cancelar.emit();  
  }
  http = inject(HttpClient);
  router = inject(Router);
  estadoCivilEntries:  any[] = [];
  estadosCivil = new EstadoCivil();
  estadoCivilAuxiliar = new EstadoCivil();
  descripcion = "";

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
          this.estadoCivilAuxiliar = new EstadoCivil().fromJson(data[0]);
          console.log("Respuesta API:", data); 
          console.log("estadoCivilAuxiliar:", this.estadoCivilAuxiliar); 
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }
  
  

  
  
  EditarEstadoCivil()  {
    this.estadosCivil.usua_Modificacion = 2;
    this.estadosCivil.esCi_FechaModificacion = new Date;
    this.http.post(`${this.apiUrl}/EstadoCivil/Editar`, this.estadosCivil)
    .subscribe();
    alert("El estado civil se creo con exito" + this.estadosCivil.esci_Descripcion);
    this.router.navigate(['/']);
  }
}
