import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Sucursal} from '../../models/sucursales.model'
import { environment } from 'src/enviroments/enviroment';
import {Municipios} from '../../models/municipio.model'
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  
  listarMunicipios(): void {
    this.http.get(`${this.apiUrl}/Municipio/Listar`)
      .subscribe((res: any) => {
        this.municipios = res.map((municipio: any) => ({
          label: municipio.muni_Descripcion, // Texto que se mostrará en el dropdown
          value: municipio.muni_Codigo      // Valor que se enviará al backend
        }));
      });
  }

  cancelarFormulario() {
    this.cancelar.emit();  
  }
  router = inject(Router)
  sucursal = new Sucursal();

  municipios: any[] = [];
  municipos = new Municipios();

  

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
