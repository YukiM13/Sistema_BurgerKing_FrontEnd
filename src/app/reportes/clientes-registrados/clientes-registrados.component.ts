import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cliente } from 'src/app/models/clientes.model';
import { environment } from 'src/enviroments/enviroment';
import { CalendarModule } from 'primeng/calendar';
import {CommonModule, NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'app-clientes-registrados',
  standalone: true,
  imports: [CommonModule,CalendarModule, FormsModule],
  templateUrl: './clientes-registrados.component.html',
  styleUrl: './clientes-registrados.component.scss'
})
export class ClientesRegistradosComponent {
   private apiUrl = environment.apiUrl; 
  
          http = inject(HttpClient);
    @ViewChild('pdfIframe') pdfIframe!: ElementRef;
  
    ngAfterViewInit() {
     
    }
  
  
    combos: any[] = [];
    cliente = new Cliente
  
    listarClientes(): void {
      console.log(this.cliente)
      this.http.post<Cliente[]>(`${this.apiUrl}/Cliente/ClientesRegistrados`, this.cliente)
        .subscribe((res: any) => {
          this.combos = res.map((estado: any) => ({
            ...estado
          }));
          console.log(this.combos);
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
  
      const maxRowsPerPage = 15;
      let rowCount = 0;
      let pageCount = 1;
      let cont = 1;
      function formatoFecha(fecha: Date): string {
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // ¡Ojo! Los meses empiezan desde 0
        const anio = fecha.getFullYear();
        return `${dia}-${mes}-${anio}`;
      }
      function agregarEncabezadoPie() {
        doc.addImage('assets/layout/images/logo-lc.png', 'PNG', 20, 5, 10, 10); 
        doc.addImage('assets/layout/images/bk-name.png', 'PNG', 30, 1, 60, 20); 
        
  
          doc.setFontSize(18);
          doc.text('Listado de Clientes', 75, 30);
          doc.setFontSize(12);
        //  doc.text(`Fecha: ${formatoFecha(new Date())}`, 20, 40);
        }
        agregarEncabezadoPie();
      function agregarPiePagina() {
          doc.setFontSize(10);
          doc.text(`Generado por: ${localStorage.getItem("usuario")} Correo: BurgerKing@whopper.com`, 15, 285);
        doc.text(`Fecha: ${formatoFecha(new Date())}`,  120, 285);
       doc.text(`Página ${pageCount}`,  180, 285);
      }
    
     
    
      const filas = this.combos.map(combo => [
          combo.id = cont,
          combo.clie_Identidad_Rtn,
          combo.clie_Nombre + '' + combo.clie_Apellido,
          combo.clie_Sexo == 'F' ? 'Femenino' : 'Masculino',
          cont++
        
      ]);
    
      autoTable(doc,{
          head: [['ID', 'Identidad', 'Nombre', 'Sexo']],
          body: filas,
          startY: 40,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 2 },
          columnStyles: { 0: { cellWidth: 15 }, 
          3: { cellWidth: 30 } },
          headStyles: { fillColor: [255, 135, 50], textColor: 255, fontSize: 10, fontStyle: 'bold', halign: 'center' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          didDrawPage: function (data) {
              if (rowCount >= maxRowsPerPage) {
                  doc.addPage();
                  pageCount++;
                  agregarEncabezadoPie();
              }
              agregarPiePagina();
          },
         
       
      
      });
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
  
      if (this.pdfIframe?.nativeElement) {
        this.pdfIframe.nativeElement.src = url;
      }
      
    }
  
  
  
    cargarImagenComoBase64(url: string): Promise<string> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL(); // Retorna el tipo según la imagen (auto detecta)
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = url;
      });
    }
}
