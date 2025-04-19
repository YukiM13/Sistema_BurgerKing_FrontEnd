import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Venta } from 'src/app/models/ventas.model';
import { VentaDetalle } from 'src/app/models/ventaDetalles';
import { environment } from 'src/enviroments/enviroment';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
   private apiUrl = environment.apiUrl; 
    @Input() ventaId: number = 0;
    @Output() cancelar = new EventEmitter<void>();  
    cancelarFormulario() {
      this.cancelar.emit();  
    }
    http = inject(HttpClient);
    router = inject(Router);
    ventasEntries:  any[] = [];
    ventaDetalleEntries:  any[] = [];
    venta = new Venta();
    ventaDetalle = new VentaDetalle();
    ventaAux = new Venta();
    ventaDetalleAux:  VentaDetalle[] = [];
    descripcion = "";
    total = 0;
    iva = 0;
    subtotal = 0;
  
    ngOnInit(): void {
      this.venta.vent_Id = this.ventaId;
      this.ventaDetalle.vent_Id = this.ventaId;
      this.http.post<Venta[]>(`${this.apiUrl}/Venta/Buscar`, this.venta)
        .subscribe(data => {
          if (data && data.length > 0) {
            this.ventaAux = data[0];
            this.ventasEntries = Object.entries(this.ventaAux);
            console.log("Entrada",this.ventasEntries);
            console.log("Respuesta API:", data); 
            console.log("estadoCivilAuxiliar:", this.ventaAux); 
          } else {
            console.error("No se recibió una respuesta válida de la API");
          }
        }, error => {
          console.error("Error al cargar datos:", error);
        });
  
      this.http.post<VentaDetalle[]>(`${this.apiUrl}/VentaDetalle/Buscar`, this.ventaDetalle)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.ventaDetalleAux = data.map(item => new VentaDetalle(item));
          this.subtotal += this.ventaDetalleAux.reduce((acc, item) => acc + (item.veDe_Cantidad * item.veDe_Precio), 0);
          this.iva = this.subtotal * 0.15;
          this.total = this.subtotal + this.iva;
          console.log("Entrada",this.ventaDetalleEntries);
          console.log("Respuesta API:", data); 
          console.log("estadoCivilAuxiliar:", this.ventaDetalleAux); 
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });
  
    }
}
