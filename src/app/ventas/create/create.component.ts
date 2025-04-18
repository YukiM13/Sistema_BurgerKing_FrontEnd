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

      constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
      ) {}
    cont = 0;
    cont1 = 0;
    cont2 = 0;
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

        this.venta.usua_Creacion = 2;
        const fecha = new Date();
        this.venta.vent_FechaCreacion = fecha;
        this.http.post<Venta[]>(`${this.apiUrl}/Venta/Insertar`, this.venta)
        .subscribe(data =>{
          if (data && Array.isArray(data) && data.length > 0) {
            const producto1 = data[0] as any; 
            this.ventaDetalle.vent_Id = producto1.vent_Id;
          }
    
          
          this.ventaDetalle.usua_Creacion = 2;
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
   
      }
      
      seleccionados: {
        comb_Id: number;
        descripcion: string;
        precio: number;
        cantidad: number;
      }[] = [];
      
      // Agregar combo
      agregarCombo(combo: any) {
        // `combo` debe tener comb_Id, comb_Descripcion, y comb_Precio
        const existente = this.seleccionados.find(s => s.comb_Id === combo.comb_Id);
      
        if (existente) {
          existente.cantidad += 1;
        } else {
          this.seleccionados.push({
            comb_Id: combo.comb_Id,
            descripcion: combo.comb_Descripcion,
            precio: combo.comb_Precio,
            cantidad: 1
          });
        }
      }
      
      // Disminuir cantidad
      decrementarCantidad(comb_Id: number) {
        const existente = this.seleccionados.find(s => s.comb_Id === comb_Id);
      
        if (existente) {
          existente.cantidad -= 1;
      
          if (existente.cantidad <= 0) {
            this.seleccionados = this.seleccionados.filter(s => s.comb_Id !== comb_Id);
          }
        }
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
}
