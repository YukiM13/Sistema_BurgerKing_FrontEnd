import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {EstadoCivil} from '../../models/estadosCiviles.model'

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  http = inject(HttpClient);
  
  router = inject(Router)
  estadosCivil = new EstadoCivil();
  crearEstadoCivil()  {
    this.estadosCivil.usua_Creacion = 2;
    const fecha = new Date();
    this.estadosCivil.esCi_FechaCreacion = fecha;  
    this.http.post('https://localhost:7147/EstadoCivil/Insertar', this.estadosCivil)
    .subscribe();
    alert("El estado civil se creo con exito" + this.estadosCivil.esci_Descripcion);
    this.router.navigate(['/']);
  }
}
