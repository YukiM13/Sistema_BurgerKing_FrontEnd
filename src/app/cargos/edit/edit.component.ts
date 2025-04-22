import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Cargo } from '../../models/cargos.model'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})

export class CargoEditComponent {
  private apiUrl = environment.apiUrl; 
  @Input() cargoId: number = 0;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() actualizado = new EventEmitter<void>();
  cancelarFormulario() {
    this.cancelar.emit();  
  }

  http = inject(HttpClient);
  router = inject(Router);
  cargo = new Cargo();
  cont = 0;

  constructor(private messageService: MessageService) { }

  EditarCargo()  {
    this.cont = 1;
    if(!this.cargo.carg_Descripcion.trim())
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia!',
        detail: 'Campos Vacios.'
      });
      return;
    }

    this.cargo.usua_Modificacion = 2;
    this.cargo.carg_FechaModificacion = new Date;
    this.http.put(`${this.apiUrl}/Cargo/Editar`, this.cargo)
    .subscribe(() => {
      this.actualizado.emit();
    });
   
  }

  ngOnInit(): void {
    this.cargo.carg_Id = this.cargoId;
    this.cont = 0;
    this.http.post<Cargo[]>(`${this.apiUrl}/Cargo/Find`, this.cargo)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.cargo = data[0];
          console.log("Respuesta API:", data); 
          console.log("estadoCivilAuxiliar:", this.cargo); 
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  }

}
