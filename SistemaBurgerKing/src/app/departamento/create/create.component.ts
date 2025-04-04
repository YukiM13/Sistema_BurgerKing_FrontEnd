import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Departamento } from 'src/app/models/departamento.model';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  http = inject(HttpClient); //inicializa el cliente http
  router = inject(Router); //inicializa el router


  departamento = new Departamento(); //inicializa el objeto departamento

  crearDepartamento() {
   //meter campos de auditoria
    this.departamento.usua_Creacion = 2; //usuario de creación
    const fecha = new Date();
    fecha.toLocaleDateString;
    this.departamento.depa_FechaCreacion = fecha; //fecha de creación

    this.http.post('https://localhost:7147/Departamento/Insertar', this.departamento)
    .subscribe(() =>{
      alert("Departamento creado con éxito" + this.departamento.depa_Descripcion); //muestra un mensaje de éxito;
      this.router.navigate(['/']); //redirecciona a la lista de departamentos

    }
     
    );

  }
}
