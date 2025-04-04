import { Component, inject, OnInit } from '@angular/core'; 
import {CommonModule, NgFor} from '@angular/common'; //trae operdaores de angular
import { RouterModule } from '@angular/router'; //Trae los link de las rutas del endpoint
import { HttpClient } from '@angular/common/http'; //Trae el cliente http




@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  
  http = inject(HttpClient); //inicializa el cliente http

  departamentos: any[] = []; //inicializa el array de departamentos

  ngOnInit(): void {
    this.http.get<any[]>('https://localhost:7147/Departamento/Listar')
    .subscribe(data => 
      this.departamentos = data //asigna los datos a la variable departamentos
    );

  }
}
