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
export class EsCiEditComponent implements OnChanges{
  private apiUrl = environment.apiUrl; 
  @Input() estadoCivil: any;
  @Output() cancelar = new EventEmitter<void>();  
  cancelarFormulario() {
    this.cancelar.emit();  
  }
  http = inject(HttpClient);
  router = inject(Router);
  estadocivil: any[] = [];
  estadosCivil = new EstadoCivil();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadoCivil'] && this.estadoCivil) {
      this.estadosCivil = { ...this.estadoCivil };
    }
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
