import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {EstadoCivil} from '../../models/estadosCiviles.model'

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  http = inject(HttpClient);
  router = inject(Router);
  estadocivil: any[] = [];
  estadosCivil = new EstadoCivil();
  ObtenerEstadoCivil(id: number)  {
   
    this.estadosCivil.esCi_Id = id;
    this.http.post<EstadoCivil>('https://localhost:7147/EstadoCivil/Find', this.estadosCivil)
    .subscribe(data => this.estadosCivil = data);
    //this.estadocivil = this.estadosCivil;
   
  }
  EditarEstadoCivil()  {
    this.estadosCivil.usua_Modificacion = 2;
    this.estadosCivil.esCi_FechaModificacion = new Date;
    this.http.post('https://localhost:7147/EstadoCivil/Editar', this.estadosCivil)
    .subscribe();
    alert("El estado civil se creo con exito" + this.estadosCivil.esci_Descripcion);
    this.router.navigate(['/']);
  }
}
