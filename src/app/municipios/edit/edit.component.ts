import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Municipios } from '../../models/municipio.model'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ButtonModule,FormsModule, DropdownModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class MuniEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() muniId: string = "";
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();

  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  municipio = new Municipios();
  cont = 0;

  constructor(private messageService: MessageService) { }

  EditarMunicipio()  {
    this.cont = 1;
    if(!this.municipio.muni_Descripcion.trim() || !this.municipio.depa_Codigo) 
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia!',
        detail: 'Campos Vacios.'
      });
      return;
    }

    this.municipio.usua_Modificacion =  Number(localStorage.getItem('usuario_id'));
    this.municipio.muni_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/Municipio/Editar`, this.municipio)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }

  departamentos: any[] = [];

  listarDepartamentos(): void {
    this.http.get<any[]>(`${this.apiUrl}/Departamento/Listar`)
      .subscribe({
        next: (response) => {
          
         this.departamentos = response;
          
         // console.log(this.departamentos);
          
        },
        error: (error) => {
         
          this.departamentos = [];
        }
      });
  }

  ngOnInit(): void {
    this.listarDepartamentos();

    this.municipio.muni_Codigo = this.muniId;
    this.cont = 0;
    this.http.post<Municipios[]>(`${this.apiUrl}/Municipio/Find`, this.municipio)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.municipio = data[0];
          console.log("Respuesta API:", data); 
          
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }

}
