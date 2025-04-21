import { Component,EventEmitter,inject,Input,OnChanges,OnInit, Output, SimpleChanges } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { Venta } from 'src/app/models/ventas.model';
import { VentaDetalle } from 'src/app/models/ventaDetalles';
import { environment } from 'src/enviroments/enviroment';
import { Table, TableModule } from 'primeng/table';

import jsPDF from 'jspdf';
@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.scss'
})
export class FacturaComponent {
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

  imprimirFactura(accion: number) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150] 
    });
    
    let y = 10;

   

    doc.addImage('assets/layout/images/bk-name_bw.png', 'PNG', 10, 5, 60, 20); 
    doc.setFont('helvetica', 'bold');
    
    y += 12;
    doc.setFontSize(8);
    doc.text(`${this.ventaAux.sucu_Descripcion}, ${this.ventaAux.muni_Descripcion}, ${this.ventaAux.depa_Descripcion}`, 5, y, );
   
    y += 4;
    
    doc.text(`RTN: 0501-1994-00006`, 40, y, { align: 'center' });

    
    const fecha = new Date(this.ventaAux.vent_Fecha);
const fechaFormateada = fecha.toLocaleString('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
   
    y += 5;
   
    doc.text(` ${fechaFormateada} `, 40, y, { align: 'center' });

     y += 5;

    if(this.ventaAux.clie_Identidad_Rtn != '9999-9999-99999')
      {
        doc.text(`RTN cliente: ${this.ventaAux.clie_Identidad_Rtn}`, 40, y, { align: 'center' });
      }
      
    y += 5;
    doc.setFontSize(10);
   
    doc.text(`Orden # BK-${this.ventaAux.vent_Id}`, 40, y, { align: 'center' });
    y += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.line(5, y, 75, y); 
    y += 3;

    doc.setFontSize(10);
    doc.text('Cant  Producto                P.Unit     SubTotal', 5, y);
    y += 4;

    let subtotal = 0;

    this.ventaDetalleAux.forEach(p => {
      const sub = p.veDe_Precio * p.veDe_Cantidad;
      subtotal += sub;

      doc.setFontSize(9);
      doc.text(`${p.veDe_Cantidad}`, 5, y);
      doc.text(`${p.comb_Descripcion}`, 15, y);
      doc.text(`L.${p.veDe_Precio.toFixed(2)}`, 45, y);
      doc.text(`L.${sub.toFixed(2)}`, 62, y);
      y += 4;
    });

    y += 2;
    doc.line(5, y, 75, y); 
    y += 4;

    const isv = subtotal * 0.15;
    const total = subtotal + isv;
    doc.setFontSize(9);
    doc.text(`Subtotal:`, 45, y);
    doc.text(`L.${subtotal.toFixed(2)}`, 62, y);
    y += 5;
    doc.setFontSize(9);
    doc.text(`ISV 15%:`, 45, y);
    doc.text(`L.${isv.toFixed(2)}`, 62, y);
    y += 5;
    doc.setFontSize(10);
    doc.text(`TOTAL:`, 45, y);
    doc.text(`L.${total.toFixed(2)}`, 62, y);
    y += 5;

    const totalLetras = this.numeroALetras(total);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.getWidth(); 
    const margin = 5; 
    const maxTextWidth = pageWidth - margin * 2; 
    
    const lines = doc.splitTextToSize('Son: ' + totalLetras, maxTextWidth); 
    
    doc.text(lines, 5, y);
    
    
    y += lines.length * 5; 
    doc.line(5, y, 75, y); 
    y += 5;
    doc.text('Gracias por su compra', 40, y, { align: 'center' });
    
    if(accion === 1) {
      doc.save(`factura_${this.ventaAux.vent_Fecha}_${this.ventaAux.clie_NombreC}.pdf`);
    }
    else if(accion === 2) {
      doc.autoPrint(); // Esta línea hace que se abra el cuadro de impresión

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url); // Abre el PDF en otra pestaña listo para imprimir
    }
  }

  numeroALetras(num: number): string {
    const [entero, decimal] = num.toFixed(2).split('.');
    return this.convertirNumeroALetras(parseInt(entero)) + ' lempiras con ' + decimal + '/100';
  }

  convertirNumeroALetras(n: number): string {
    const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince'];
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  
    if (n === 0) return 'cero';
    if (n === 100) return 'cien';
  
    let letras = '';
  
    const miles = Math.floor(n / 1000);
    const resto = n % 1000;
  
    
    if (miles > 0) {
      if (miles === 1) {
        letras += 'mil ';
      } else {
        letras += this.convertirNumeroALetras(miles) + ' mil ';
      }
    }
  
   
    const c = Math.floor(resto / 100);
    const d = Math.floor((resto % 100) / 10);
    const u = resto % 10;
  
    if (resto === 100) {
      letras += 'cien';
    } else {
      if (c > 0) letras += centenas[c] + ' ';
      
      if (d === 1 && u <= 5) letras += especiales[u];
      else if (d === 1 && u > 5) letras += 'dieci' + unidades[u];
      else if (d === 2 && u === 0) letras += 'veinte';
      else if (d === 2) letras += 'veinti' + unidades[u];
      else if (d > 2) {
        letras += decenas[d];
        if (u > 0) letras += ' y ' + unidades[u];
      } else if (d === 0 && u > 0) {
        letras += unidades[u];
      }
    }
  
    return letras.trim();
  }

}
