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
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule,FileUploadModule, ConfirmDialogModule,ToastModule,DropdownModule,MultiSelectModule,DialogModule, TableModule],
  providers:[MessageService, ConfirmationService],

  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
 private apiUrl = environment.apiUrl; 
      productos2: any[] = [];
      http = inject(HttpClient);
      @Input() comboId: number = 0;
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
  onUpload(event: any) {
    console.log('entro');
    const file = event.files[0];
    const reader = new FileReader();
    this.selectedFile = file;
    this.nombreOriginal = file.name;
    console.log('verificacion asginacion',this.selectedFile);
    this.combo.comb_ImgUrl = 'assets/layout/imagenes/' + this.nombreOriginal;
  console.log(file.name);
    reader.onload = (e: any) => {
      console.log('Imagen cargada:', e.target.result);
  
    };
    reader.readAsDataURL(file);
  };
  uploadImage(): Observable<any> {
    this.cont2 = 1;
    const formData = new FormData();
    formData.append('imagen', this.selectedFile!);
    return this.http.post(`${this.apiUrl}/Producto/subirImagen`, formData);
  }
  seleccionado: {
    prta_Id: number;
    cantidad:number;
   
  }[] = [];
  
  buscarCombo(){
    this.producto.comb_Id = this.comboId;
          this.comboDetalle.comb_Id = this.comboId;
          this.http.post<Combo[]>(`${this.apiUrl}/Combo/Find`, this.producto)
            .subscribe(data => {
              if (data && data.length > 0) {
                this.combo = data[0];
               
                console.log("Respuesta API:", data); 
                console.log("estadoCivilAuxiliar:", this.combo); 
              } else {
                console.error("No se recibió una respuesta válida de la API");
              }
            }, error => {
              console.error("Error al cargar datos:", error);
            });
      
          this.http.post<ComboDetalle[]>(`${this.apiUrl}/ComboDetalle/Buscar`, this.comboDetalle)
          .subscribe(data => {
            if (data && data.length > 0) {
              this.comboDetalleAux = data.map(item => new ComboDetalle(item));
              
              this.seleccionado = this.comboDetalleAux.map(item => ({
                prta_Id: item.prTa_Id,
                cantidad: item.coDe_Cantidad
                
              }));
              for(let item of this.seleccionado)
              {
                this.CargarCombo(item.prta_Id, item.cantidad)
              }

             
              console.log("Respuesta API:", data); 
              console.log("estadoCivilAuxiliar:", this.comboDetalleAux); 
            } else {
              console.error("No se recibió una respuesta válida de la API");
            }
          }, error => {
            console.error("Error al cargar datos:", error);
          });
    //ComboDetalle/Buscar
    //Combo/Find
  }
  
 
  productosPorTamano: ProductoAgrupado[] = [];

ListarProductosPorTamano() {
  this.http.get<any[]>(`${this.apiUrl}/ProductoPorTamano/Listar`).subscribe({
    next: (data) => {
      const agrupados: { [key: string]: ProductoAgrupado } = {};

      for (const item of data) {
        const key = `${item.prod_Descripcion}-${item.prod_ImgUrl}`;
        if (!agrupados[key]) {
          agrupados[key] = {
            prod_Descripcion: item.prod_Descripcion,
            prod_ImgUrl: item.prod_ImgUrl,
            cate_Descripcion: item.cate_Descripcion,
            tamanios: []
          };
        }

        agrupados[key].tamanios.push({
          prTa_Id: item.prTa_Id,
          tama_Descripcion: item.tama_Descripcion,
          prTa_Precio: item.prTa_Precio
        });
      }

      this.productosPorTamano = Object.values(agrupados);
      console.log(this.productosPorTamano);
    },
    error: (err) => {
      console.error('Error al obtener los productos:', err);
    }
  });
}
      removeImage() {
        this.producto.prod_ImgUrl = '';
        this.selectedFile = null;
        this.nombreOriginal = '';
      }
      cancelarFormulario() {
        this.cancelar.emit();  
      }
      router = inject(Router)
      producto = new Combo();
      tamano = new Tamano();
      comboDetalle = new ComboDetalle();
      comboDetalleAux: ComboDetalle[]=[];
    
      combo = new Combo();
      productoAux = new Productos();
      
  
      ngOnInit(): void {
        this.cont = 0;
        this.cont1 = 0;
        this.cont2 = 0;
      
        this.ListarProductosPorTamano();
        this.buscarCombo();
      }
      
      selectedTamanios: { [descripcion: string]: number } = {};
      seleccionarTamano(prodDescripcion: string, prTaId: number) {
        this.selectedTamanios[prodDescripcion] = prTaId;
      }

      seleccionados: {
        prTa_Id: number;
        precio: number;
        descripcion: string;
        cantidad: number;
        tamano: string;
       
      }[] = [];
      comb_Precio = 0;
      total: number = 0;
      descuento: number = 0;
      totalConDescuento: number = 0;

      calcularTotal() {
        this.total = this.seleccionados.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        this.descuento = this.total * 0.05;
        this.totalConDescuento = this.total - this.descuento;
        this.comb_Precio = this.totalConDescuento;
        console.log(this.totalConDescuento);
      }
      agregarAlCombo(prTa_Id: number) {
      
        const producto = this.productosPorTamano.find(p =>
          p.tamanios.some(t => t.prTa_Id === prTa_Id)
        );
        if (!producto) return;
      
        const tamanioSeleccionado = producto.tamanios.find(t => t.prTa_Id === prTa_Id);
        if (!tamanioSeleccionado) return;
      
     
        const existente = this.seleccionados.find(s => s.prTa_Id === prTa_Id);
        if (existente) {
          existente.cantidad += 1;
        } else {
          this.seleccionados.push({
            prTa_Id: prTa_Id,
            descripcion: producto.prod_Descripcion,
            tamano: tamanioSeleccionado.tama_Descripcion,
            precio: tamanioSeleccionado.prTa_Precio,
            cantidad: 1
          });
        }
      
       
        this.calcularTotal();
      }
      

      CargarCombo(prTa_Id: number,cantidad:number ) {
      
        const producto = this.productosPorTamano.find(p =>
          p.tamanios.some(t => t.prTa_Id === prTa_Id)
        );
        if (!producto) return;
      
        const tamanioSeleccionado = producto.tamanios.find(t => t.prTa_Id === prTa_Id);
        if (!tamanioSeleccionado) return;
      
     
        const existente = this.seleccionados.find(s => s.prTa_Id === prTa_Id);
        if (existente) {
          existente.cantidad += 1;
        } else {
          this.seleccionados.push({
            prTa_Id: prTa_Id,
            descripcion: producto.prod_Descripcion,
            tamano: tamanioSeleccionado.tama_Descripcion,
            precio: tamanioSeleccionado.prTa_Precio,
            cantidad: cantidad
          });
        }
      
       
        this.calcularTotal();
      }
    prueba: any[] = [];
    decrementarCantidad(prTaId: number) {
      if (!prTaId) return; 
      
      const existente = this.seleccionados.find(s => s.prTa_Id === prTaId);
      if (existente) {
        existente.cantidad -= 1;
        

        if (existente.cantidad <= 0) {
          this.seleccionados = this.seleccionados.filter(s => s.prTa_Id !== prTaId);
          const detalle= this.comboDetalleAux.find(s => s.prTa_Id === prTaId);
          if(detalle)
          {
            this.comboDetalle.coDe_Id = detalle.coDe_Id;
            this.http.post(`${this.apiUrl}/ComboDetalle/Eliminar`, this.comboDetalle)
            .subscribe({
              next: () => {
               
            
                console.log('Detalle eliminado de la base de datos');
                this.comboDetalleAux = this.comboDetalleAux.filter(d => d.prTa_Id !== prTaId);
                console.log(this.comboDetalleAux)
              },
              error: (err) => {
                console.error('Error al eliminar el detalle en la base de datos:', err);
              }
            });
          }
        }
        
        this.calcularTotal();
      }
    }

    getCantidadProducto(prTaId: number): number {
      if (!prTaId) return 0;
      
      const existente = this.seleccionados.find(s => s.prTa_Id === prTaId);
      return existente ? existente.cantidad : 0;
    }


    EditarCombo(){
      this.combo.comb_FechaModificacion = new Date();
          this.combo.usua_Modificacion = 2;
          this.combo.comb_Precio = this.comb_Precio
          if(this.seleccionados.length<=0 || !this.combo.comb_ImgUrl || !this.combo.comb_Precio || !this.combo.comb_Descripcion)
          {
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: 'Los campos no pueden ser vacios'
            });
                  return
                
              
          }
          this.uploadImage().subscribe({
            next: () => {
              if(!(this.combo.comb_ImgUrl && this.combo.comb_Descripcion)) {
                console.log("Entro al return");
          console.log(this.combo.comb_Descripcion, this.combo.comb_Precio, this.combo.comb_ImgUrl);
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Los campos no pueden ser vacios'
          });
                return
              }
          }})
          this.http.put<Respuesta<Combo>>(`${this.apiUrl}/Combo/Editar`, this.combo)
          .subscribe({
            next: (response) => {
            if (response && response.data.codeStatus >0) {
              this.comboDetalle.usua_Modificacion = 2;
              this.comboDetalle.coDe_FechaModificacion = new Date();
              this.comboDetalle.comb_Id = this.comboId;
              this.comboDetalle.coDe_FechaCreacion = this.combo.comb_FechaCreacion;
              this.comboDetalle.usua_Creacion = this.combo.usua_Creacion;
      
              for(const item of this.seleccionados)
              {
                this.comboDetalle.prTa_Id = item.prTa_Id
                this.comboDetalle.coDe_Cantidad = item.cantidad
                
                
               
                console.log(this.comboDetalle);
                if(this.i < this.comboDetalleAux.length)
                {
                  this.comboDetalle.coDe_Id = this.comboDetalleAux[this.i].coDe_Id;
                  this.http.put<Respuesta<ComboDetalle>>(`${this.apiUrl}/ComboDetalle/Editar`, this.comboDetalle)
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
                  this.comboDetalle.coDe_FechaCreacion = new Date();
                  this.http.post<Respuesta<ComboDetalle>>(`${this.apiUrl}/ComboDetalle/Insertar`, this.comboDetalle)
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
      //municipos = new Municipios();
    
}