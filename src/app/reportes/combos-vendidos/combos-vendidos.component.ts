import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Venta } from 'src/app/models/ventas.model';
import { environment } from 'src/enviroments/enviroment';
import { CalendarModule } from 'primeng/calendar';
import {CommonModule, NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-combos-vendidos',
  standalone: true,
  imports: [CommonModule,CalendarModule, FormsModule, DropdownModule],
  templateUrl: './combos-vendidos.component.html',
  styleUrl: './combos-vendidos.component.scss'
})
export class CombosVendidosComponent {

    private apiUrl = environment.apiUrl; 
      
              http = inject(HttpClient);
        @ViewChild('pdfIframe') pdfIframe!: ElementRef;
      
        ngAfterViewInit() {
         
        }
  
        ngOnInit(): void {
        
          this.listarSucursal();
         
        }
      
        sucursal: any[] = [];
        listarSucursal(): void {
          this.http.get<any[]>(`${this.apiUrl}/Sucursal/Listar`)
            .subscribe({
              next: (response) => {
                this.sucursal = response;
              },
              error: (error) => {
                console.error('Error al listar los estados civiles:', error);
              }
            });
        }
  
        info: any[] = [];
        venta = new Venta();
      
        listarClientes(): void {
          console.log('mand esto', this.venta)
          this.http.post<Venta[]>(`${this.apiUrl}/Venta/ReporteComboSucuFech`, this.venta)
            .subscribe((res: any) => {
              this.info = res.map((estado: any) => ({
                ...estado
              }));
              console.log('temp', this.info);
              this.generarPDF();
            });
        }
      
         loadImage(url: string): Promise<HTMLImageElement> {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
          });
        }
      
        
        generarPDF() {
          const doc = new jsPDF();
          let cont = 1;
          let startY = 40;
          let pageCount = doc.getNumberOfPages();
        
          function formatoFecha(fecha: Date): string {
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            return `${dia}-${mes}-${anio}`;
          }
        
          function agregarEncabezado() {
            doc.addImage('assets/layout/images/logo-lc.png', 'PNG', 20, 5, 10, 10);
            doc.addImage('assets/layout/images/bk-name.png', 'PNG', 30, 1, 60, 20);
            doc.setFontSize(18);
            doc.text('Listado de Combos Vendidos', 65, 30);
            doc.setFontSize(12);
           // doc.text(`Fecha: ${formatoFecha(new Date())}`, 20, 40);
          }
        
          agregarEncabezado();
        
          
          const sucursales = Array.from(new Set(this.info.map(v => v.muni_Descripcion)));
        
          sucursales.forEach((sucursal) => {
            const ventasSucursal = this.info.filter(v => v.muni_Descripcion === sucursal);
            const filas = ventasSucursal.map(v => [
              cont++,
              v.veDe_Cantidad,
              v.depa_Descripcion,
            ]);
        
         
            doc.setFontSize(14);
            doc.text(`Sucursal: ${sucursal}`, 20, startY);
            startY += 5;
        
            autoTable(doc, {
              head: [['ID', 'Cantidad', 'Combo']],
              body: filas,
              startY: startY,
              theme: 'grid',
              styles: { fontSize: 9 },
              headStyles: { fillColor: [255, 135, 50], halign: 'center' },
              alternateRowStyles: { fillColor: [245, 245, 245] },
              margin: { top: 10 },
              didDrawPage: (data) => {
                if (data.cursor) {
                  startY = data.cursor.y + 10;
                }
              },
            });
            
          });
        
        
          doc.setFontSize(10);
          doc.text(`Generado por: ${localStorage.getItem("usuario")} Correo: BurgerKing@whopper.com`, 15, 285);
           doc.text(`Fecha: ${formatoFecha(new Date())}`,  120, 285);
          doc.text(`Página ${pageCount}`,  180, 285);


          const blob = doc.output('blob');
          const url = URL.createObjectURL(blob);
          if (this.pdfIframe?.nativeElement) {
            this.pdfIframe.nativeElement.src = url;
          }
        }
        
        

}
