import { Component,EventEmitter,inject,Input,OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule,PaginatorModule, FormsModule,FileUploadModule, ConfirmDialogModule,ToastModule,DropdownModule,MultiSelectModule,DialogModule, TableModule,ClienteCreateComponent],
  providers:[MessageService, ConfirmationService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  private apiUrl = environment.apiUrl; 
      productos2: any[] = [];
      http = inject(HttpClient);
      @Input() ventaId: number = 0;
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
    i = 0;
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
  
  editarVenta(){
    this.ventaAux.vent_FechaModificacion = new Date();
    this.ventaAux.usua_Modificacion = 2;
    this.http.put<Respuesta<Venta>>(`${this.apiUrl}/Venta/Editar`, this.ventaAux)
    .subscribe({
      next: (response) => {
      if (response && response.data.codeStatus >0) {
        this.ventaDetalle.usua_Modificacion = 2;
        this.ventaDetalle.veDe_FechaModificacion = new Date();
        this.ventaDetalle.vent_Id = this.ventaId;
        this.ventaDetalle.veDe_FechaCreacion = this.ventaAux.vent_FechaCreacion;
        this.ventaDetalle.usua_Creacion = this.ventaAux.usua_Creacion;

        for(const item of this.seleccionados)
        {
          this.ventaDetalle.comb_Id = item.comb_Id
          this.ventaDetalle.veDe_Cantidad = item.cantidad
          this.ventaDetalle.veDe_Precio = item.precio;
          
         
          console.log(this.ventaDetalle);
          if(this.i < this.ventaDetalleAux.length)
          {
            this.ventaDetalle.veDe_Id = this.ventaDetalleAux[this.i].veDe_Id;
            this.http.put<Respuesta<Venta>>(`${this.apiUrl}/VentaDetalle/Editar`, this.ventaDetalle)
            .subscribe({
              next: (response) => {
              if (response && response.data.codeStatus >0) {
                this.creado.emit();
              }
              else{
                this.errorCrear.emit();
              }
            }
            })
          }
          else
          {
            console.log("Insertar")
            this.ventaDetalle.veDe_FechaCreacion = new Date();
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
          this.i++;
        }
      } else {
        this.errorCrear.emit();
      }
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
     
  
      ngOnInit(): void {
        this.cont = 0;
        this.cont1 = 0;
        this.cont2 = 0;
        console.log('Entro');
        this.venta.vent_Fecha = new Date();
        this.listarCombos();
        this.listarClientes();
        this.buscarVenta();
        
      }
      
      seleccionados: {
        comb_Id: number;
        descripcion: string;
        precio: number;
        cantidad: number;
      }[] = [];
      
     
      agregarCombo(combo: any) {
   
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
      
     
      decrementarCantidad(comb_Id: number) {
        const existente = this.seleccionados.find(s => s.comb_Id === comb_Id);
      
        if (existente) {
          existente.cantidad -= 1;
      
          if (existente.cantidad <= 0) {
            this.seleccionados = this.seleccionados.filter(s => s.comb_Id !== comb_Id);
            const detalle= this.ventaDetalleAux.find(s => s.comb_Id === comb_Id);
            if(detalle)
            {
              this.ventaDetalle.veDe_Id = detalle.veDe_Id;
              this.http.post(`${this.apiUrl}/VentaDetalle/Eliminar`, this.ventaDetalle)
              .subscribe({
                next: () => {
                 
              
                  console.log('Detalle eliminado de la base de datos');
                  this.ventaDetalleAux = this.ventaDetalleAux.filter(d => d.comb_Id !== comb_Id);
                  console.log(this.ventaDetalleAux)
                },
                error: (err) => {
                  console.error('Error al eliminar el detalle en la base de datos:', err);
                }
              });
            }
           
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

  this.clientesFiltrados = this.clientes.filter(cliente =>
    cliente.clie_Identidad_Rtn.includes(this.filtroActual)
  );

  
  this.mostrarAgregarCliente = this.clientesFiltrados.length === 0;
}

abrirModalAgregarCliente() {

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

ventaAux = new Venta();
ventaDetalleAux:  VentaDetalle[] = [];
descripcion = "";
total = 0;
iva = 0;
subtotal = 0;

buscarVenta(){
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
          this.seleccionados = this.ventaDetalleAux.map(item => ({
            comb_Id: item.comb_Id,
            descripcion: item.comb_Descripcion,
            precio: item.veDe_Precio,
            cantidad: item.veDe_Cantidad
          }));
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
