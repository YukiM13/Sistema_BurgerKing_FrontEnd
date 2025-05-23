import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Respuesta } from '../../models/respuesta.model';
import { Cargo } from '../../models/cargos.model'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule,ButtonModule, FormsModule, ToastModule ],
  providers: [MessageService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CargoCreateComponent {
  private apiUrl = environment.apiUrl; 
  estadosCivil2: any[] = [];
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
  @Output() errorCrear = new EventEmitter<void>();
 
  cont = 0;
  ngOnInit(): void {
    this.cont = 0;
    //console.log('usa', Number(localStorage.getItem('usuario_id')))
  }


  cancelarFormulario() {
    this.cancelar.emit();  
  }

    constructor(private messageService: MessageService) { }


  router = inject(Router)
  cargos = new Cargo();

  crearCargo()  {
    this.cont = 1;
    if(!this.cargos.carg_Descripcion.trim())
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Campos Vacios.'
      });
      return;
    }


    this.cargos.usua_Creacion=   Number(localStorage.getItem('usuario_id'));
    const fecha = new Date();
    this.cargos.carg_FechaCreacion = fecha;  
    this.http.post<Respuesta<Cargo>>(`${this.apiUrl}/Cargo/Insertar`, this.cargos)
    .subscribe({
      next: (response) => {
      if (response && response.data.codeStatus >0) {
        console.log(response)
        this.creado.emit();
      } else {
        this.errorCrear.emit();
      }
    }
    });

    
    
    
    
  }
}
