import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {EstadoCivil} from '../../models/estadosCiviles.model'
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class EsCiListComponent implements OnInit {
  http = inject(HttpClient);
    router = inject(Router);
  estadoCivil = new EstadoCivil();
  ObtenerEstadoCivil(id: number)  {
    alert("id obtenido: "+ id);
    this.estadoCivil.esCi_Id = id;
    this.http.post<EstadoCivil>('https://localhost:7147/EstadoCivil/Find', this.estadoCivil)
    .subscribe(data => this.estadoCivil = data);
    
  }

    estadosCivil: any[] = [];
    ngOnInit()  {
    this.http.get<any[]>('https://localhost:7147/EstadoCivil/Listar')
    .subscribe(data => this.estadosCivil = data);
    
  }


}
