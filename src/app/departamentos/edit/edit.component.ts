import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Departamento } from '../../models/departamento.model'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule,ButtonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class DepartamentoEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() depaId: string = "";
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();
  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  departamento = new Departamento();
  cont = 0;

  constructor(private messageService: MessageService) { }

  EditarDepartamento()  {
    this.cont = 1;
    if(!this.departamento.depa_Descripcion.trim())
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia!',
        detail: 'Campos Vacios.'
      });
      return;
    }

    this.departamento.usua_Modificacion =  Number(localStorage.getItem('usuario_id'));
    this.departamento.depa_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/Departamento/Editar`, this.departamento)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }

  ngOnInit(): void {
    this.cont = 0;
    this.departamento.depa_Codigo = this.depaId;
  
    this.http.post<Departamento[]>(`${this.apiUrl}/Departamento/Find`, this.departamento)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.departamento = data[0];
          //console.log("Respuesta API:", data); 
        
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }

}

