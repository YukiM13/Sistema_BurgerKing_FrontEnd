import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Sucursal} from '../../models/sucursales.model'
import { environment } from 'src/enviroments/enviroment';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})




export class SucursalCreateComponent {
 private apiUrl = environment.apiUrl; 
  //estadosCivil2: any[] = [];
  
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
 
  ngOnInit(): void {
    this.listarMunicipios();
  }
  
  municipios: any[] = [];
  //municipos = new Municipios();

  listarMunicipios(): void {
    this.http.get<any[]>(`${this.apiUrl}/Municipio/Listar`)
      .subscribe({
        next: (response) => {
          
          this.municipios = response; 
          
        },
        error: (error) => {
         
          this.municipios = [];
        }
      });
  }

  cancelarFormulario() {
    this.cancelar.emit();  
  }
  router = inject(Router)
  sucursal = new Sucursal();



  

  crearSucursal()  {
   
    this.sucursal.usua_Creacion = 2;
    const fecha = new Date();
    this.sucursal.sucu_FechaCreacion = fecha;  
    this.http.post(`${this.apiUrl}/Sucursal/Insertar`, this.sucursal)
    .subscribe(() => {
      this.creado.emit();
    }

    );
    
    
    
  }
}
