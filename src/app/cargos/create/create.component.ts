import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Cargo } from '../../models/cargos.model'
import { environment } from 'src/enviroments/enviroment';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
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
 
  cont = 0;
  ngOnInit(): void {
    this.cont = 0;
  }


  cancelarFormulario() {
    this.cancelar.emit();  
  }

    constructor(private messageService: MessageService) { }


  router = inject(Router)
  cargos = new Cargo();

  crearCargo()  {
    this.cont = 1;
    if(!this.cargos.carg_Descripcion)
    {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Campos Vacios.'
      });
      return;
    }


    this.cargos.usua_Creacion= 2;
    const fecha = new Date();
    this.cargos.carg_FechaCreacion = fecha;  
    this.http.post(`${this.apiUrl}/Cargo/Insertar`, this.cargos)
    .subscribe(() => {
      this.creado.emit();
    }

    );
    
    
    
  }
}
