import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {Productos} from '../../models/producto.model'
import { environment } from 'src/enviroments/enviroment';
import { FileUploadModule } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { Respuesta } from 'src/app/models/respuesta.model';
import { Tamano } from 'src/app/models/tamano.model';
import { Combo } from 'src/app/models/combos.model'; 
import { ComboDetalle } from 'src/app/models/comboDetalles.model';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Venta } from 'src/app/models/ventas.model';
import { ClienteCreateComponent } from 'src/app/clientes/create/create.component';
import { PaginatorModule } from 'primeng/paginator';
import { VentaDetalle } from 'src/app/models/ventaDetalles';
import jsPDF from 'jspdf';

interface PrecioTamanio {
  prTa_Id: number;
  tama_Descripcion: string;
  prTa_Precio: number;
}

interface ProductoAgrupado {
  prod_Descripcion: string;
  prod_ImgUrl: string;
  cate_Descripcion : string;
  tamanios: PrecioTamanio[];
}
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule,PaginatorModule, FormsModule,FileUploadModule, ConfirmDialogModule,ToastModule,DropdownModule,MultiSelectModule,DialogModule, TableModule,ClienteCreateComponent],
  providers:[MessageService, ConfirmationService],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class VentaCreateComponent {
private apiUrl = environment.apiUrl; 
      productos2: any[] = [];
      http = inject(HttpClient);
      @Output() cancelar = new EventEmitter<void>();  
      @Output() creado = new EventEmitter<void>();
      @Output() errorCrear = new EventEmitter<void>();
      uploadedFiles: any[] = [];
    ventaId: number = 0;
      constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
      ) {}
    cont = 0;
    cont1 = 0;
    cont2 = 0;
    subtotal = 0;
    isv = 0;
    total=0;
    aux = 0;
      showRemove: boolean = false;
    url = this.apiUrl;
      selectedFile: File | null = null;
      nombreOriginal: string = '';
  

     
 
  combos: any[] = [];


  listarCombos(): void {
    this.http.get(`${this.apiUrl}/Combo/Listar`)
      .subscribe((res: any) => {
        this.combos = res.map((estado: any) => ({
          ...estado
        }));
        if(this.ventaId != 0)
        {
        var comboSele: any[] = [];
         comboSele = this.combos.filter(combo => combo.comb_Id == this.ventaId);
         console.log("comboSele",comboSele);
         this.agregarCombo(comboSele[0]);
          this.ventaId = 0;
        }
      });
  }
  
  


      
      cancelarFormulario() {
        this.cancelar.emit();  
      }
      router = inject(Router)
      venta = new Venta();
      tamano = new Tamano();
      ventaDetalle = new VentaDetalle();
      productoAux = new Productos();
      crearCombo()  {
        this.cont = 1;
        console.log('entro');
        this.venta.sucu_Id= Number(localStorage.getItem('sucursal_id'));
        if(!this.venta.clie_Id || !this.venta.sucu_Id || !this.venta.vent_Fecha || this.seleccionados.length == 0){
          this.messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'Campos Vacios.'
          });
          return;
        }

        this.venta.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
        const fecha = new Date();
        this.venta.vent_FechaCreacion = fecha;
        this.http.post<Venta[]>(`${this.apiUrl}/Venta/Insertar`, this.venta)
        .subscribe(data =>{
          if (data && Array.isArray(data) && data.length > 0) {
            const producto1 = data[0] as any; 
            this.ventaDetalle.vent_Id = producto1.vent_Id;
            localStorage.setItem('venta_id', producto1.vent_Id.toString());
          }
    
          
          this.ventaDetalle.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
          this.ventaDetalle.veDe_FechaCreacion = fecha;
          for(const item of this.seleccionados)
          {
            this.ventaDetalle.comb_Id = item.comb_Id
            this.ventaDetalle.veDe_Cantidad = item.cantidad
            this.ventaDetalle.veDe_Precio = item.precio;
            console.log(this.ventaDetalle);
           

              this.http.post<Respuesta<VentaDetalle>>(`${this.apiUrl}/VentaDetalle/Insertar`, this.ventaDetalle)
                        .subscribe({
                          next: (response) => {
                          if (response && response.data.codeStatus >0) {
                            console.log(response)
                            this.buscarVentas();
                            this.creado.emit();
                          } else {
                            this.errorCrear.emit();
                          }
                        }
                        });

            
          }
            
        })
       
        
      }
      
      ngOnInit(): void {
        this.cont = 0;
        this.cont1 = 0;
        this.cont2 = 0;
        console.log('Entro');
        this.venta.vent_Fecha = new Date();
        this.listarCombos();
        this.listarClientes();
        if(localStorage.getItem('agregarVenta'))
        {
          this.ventaId = Number(localStorage.getItem('agregarVenta'));
          localStorage.removeItem('agregarVenta');
          
          console.log("ventaId",this.ventaId);
        }
      }
      
      seleccionados: {
        comb_Id: number;
        descripcion: string;
        precio: number;
        cantidad: number;
      }[] = [];
      actualizarTotales() {
        this.subtotal = this.seleccionados.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
        this.isv = this.subtotal * 0.15;
        this.total = this.subtotal + this.isv;
      }
   
      agregarCombo(combo: any) {
        console.log("combo",combo);
        const existente = this.seleccionados.find(s => s.comb_Id === combo.comb_Id);
      
        if (existente) {
          console.log("existente",existente);
          existente.cantidad += 1;
        } else {
          console.log("nuevo",combo);
          this.seleccionados.push({
            comb_Id: combo.comb_Id,
            descripcion: combo.comb_Descripcion,
            precio: combo.comb_Precio,
            cantidad: 1
          });
          console.log("seleccionados",this.seleccionados);

        }
        this.actualizarTotales();
      }
      
   
      decrementarCantidad(comb_Id: number) {
        const existente = this.seleccionados.find(s => s.comb_Id === comb_Id);
      
        if (existente) {
          existente.cantidad -= 1;
      
          if (existente.cantidad <= 0) {
            this.seleccionados = this.seleccionados.filter(s => s.comb_Id !== comb_Id);
          }
        }
        this.actualizarTotales();
      }
      getCantidadCombo(comb_Id: number): number {
        const seleccionado = this.seleccionados.find(s => s.comb_Id === comb_Id);
        return seleccionado ? seleccionado.cantidad : 0;
      }
   
  
      clientes: any[] = [];
      
    
      listarClientes(): void {
        this.http.get<any[]>(`${this.apiUrl}/Cliente/Listar`)
          .subscribe({
            next: (response) => {
              
             this.clientes = response;
              
             // console.log(this.clientes);
              
            },
            error: (error) => {
             
              this.clientes = [];
            }
          });
      }

      filtroActual: string = '';
clientesFiltrados: any[] = [];
mostrarAgregarCliente: boolean = false;
mostrarModal: boolean = false;
onFiltroCliente(event: any) {
  this.filtroActual = event.filter;

  // filtrá vos también si querés (opcional)
  this.clientesFiltrados = this.clientes.filter(cliente =>
    cliente.clie_Identidad_Rtn.includes(this.filtroActual)
  );

  // Mostrar botón si no hay coincidencias
  this.mostrarAgregarCliente = this.clientesFiltrados.length === 0;
}

abrirModalAgregarCliente() {
  // tu lógica para mostrar el modal (booleana, servicio, etc.)
  this.mostrarModal = true;
}

registroCreado(){
  this.mostrarModal = false;
  this.listarClientes();
  this.messageService.add({
    severity: 'success',
    summary: 'Creado',
    detail: 'Cliente creado'
  });
  
 
}
crearError(){
  this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: 'No se pudo crear el cliente'
  });
}

cancelCreate(){
  this.mostrarModal = false;
  this.listarClientes();
  this.messageService.add({
    severity: 'info',
    summary: 'Cancelado',
    detail: 'No se creó el cliente'
  });
}

ventasEntries:  any[] = [];
ventaDetalleEntries:  any[] = [];
venta2 = new Venta();
ventaDetalle2 = new VentaDetalle();
ventaAux = new Venta();
ventaDetalleAux:  VentaDetalle[] = [];
descripcion = "";
iva = 0;

buscarVentas(){
  this.venta2.vent_Id = Number(localStorage.getItem('venta_id'));
  this.ventaDetalle2.vent_Id = Number(localStorage.getItem('venta_id'));
  this.http.post<Venta[]>(`${this.apiUrl}/Venta/Buscar`, this.venta2)
      .subscribe(data => {
        if (data && data.length > 0) {
          this.ventaAux = data[0];
          this.ventasEntries = Object.entries(this.ventaAux);
          console.log("Entrada",this.ventasEntries);
          console.log("Respuesta API:", data); 
          console.log("venta en el subscribe:", this.ventaAux); 
        } else {
          console.error("No se recibió una respuesta válida de la API");
        }
      }, error => {
        console.error("Error al cargar datos:", error);
      });

    this.http.post<VentaDetalle[]>(`${this.apiUrl}/VentaDetalle/Buscar`, this.ventaDetalle2)
    .subscribe(data => {
      if (data && data.length > 0) {
        this.ventaDetalleAux = data.map(item => new VentaDetalle(item));
        this.subtotal += this.ventaDetalleAux.reduce((acc, item) => acc + (item.veDe_Cantidad * item.veDe_Precio), 0);
        this.iva = this.subtotal * 0.15;
        this.total = this.subtotal + this.iva;
        console.log("Entrada",this.ventaDetalleEntries);
        console.log("Respuesta API:", data); 
        console.log("ventaDetalle en el subscribe:", this.ventaDetalleAux); 
      } else {
        console.error("No se recibió una respuesta válida de la API");
      }
      this.imprimirFactura();
    }, error => {
      console.error("Error al cargar datos:", error);
    });
  
}

imprimirFactura() {
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
  
   
      doc.autoPrint(); 

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url); 
    
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
