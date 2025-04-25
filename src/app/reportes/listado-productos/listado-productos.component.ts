import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/enviroments/enviroment';
@Component({
  selector: 'app-listado-productos',
  standalone: true,
  imports: [],
  templateUrl: './listado-productos.component.html',
  styleUrl: './listado-productos.component.scss'
})
export class ListadoProductosComponent {
  private apiUrl = environment.apiUrl; 

        http = inject(HttpClient);
  @ViewChild('pdfIframe') pdfIframe!: ElementRef;

  ngAfterViewInit() {
    this.listarCombos();
  }


  combos: any[] = [];


  listarCombos(): void {
    this.http.get(`${this.apiUrl}/Combo/Listar`)
      .subscribe((res: any) => {
        this.combos = res.map((estado: any) => ({
          ...estado,
          comb_ImgUrl: `${this.apiUrl}/${estado.comb_ImgUrl}`
        }));

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
        doc.text('Listado de Productos', 20, 30);
        doc.setFontSize(12);
        doc.text(`Fecha: ${formatoFecha(new Date())}`, 20, 40);
      }
      agregarEncabezadoPie();
    function agregarPiePagina() {
        doc.setFontSize(10);
        doc.text(`Generado por: ${localStorage.getItem("usuario")} Correo: BurgerKing@whopper.com`, 15, 285);
        doc.text(`Página ${pageCount}`, 180, 290);
    }
  
   
  
    const filas = this.combos.map(combo => [
        combo.id = cont,
        combo.comb_Descripcion,
        combo.comb_Precio,
        combo.comb_ImgUrl,
        cont++
      
    ]);
  
    autoTable(doc,{
        head: [['ID', 'Nombre', 'Precio', 'Imagen']],
        body: filas,
        startY: 50,
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