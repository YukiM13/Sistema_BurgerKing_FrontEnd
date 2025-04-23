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
  imports: [CommonModule, FormsModule,FileUploadModule, ConfirmDialogModule,ToastModule,DropdownModule,MultiSelectModule,DialogModule, TableModule],
  providers:[MessageService, ConfirmationService],

  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CombosCreateComponent {
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
  onUpload(event: any) {
    console.log('entro');
    const file = event.files[0];
    const reader = new FileReader();
    this.selectedFile = file;
    this.nombreOriginal = file.name;
    console.log('verificacion asginacion',this.selectedFile);
    this.producto.comb_ImgUrl = 'assets/layout/imagenes/' + this.nombreOriginal;
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
      productoAux = new Productos();
      crearCombo()  {
        this.cont = 1;
        console.log('entro');
        console.log(this.producto.comb_Descripcion, this.producto.comb_Precio, this.producto.comb_ImgUrl);
        this.producto.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
        const fecha = new Date();
        this.producto.comb_FechaCreacion = fecha;
        this.producto.comb_Precio = this.comb_Precio;
        //this.producto.cate_Id = 2
         
       
         this.uploadImage().subscribe({
          next: () => {
            if(!(this.producto.comb_ImgUrl && this.producto.comb_Descripcion)) {
              console.log("Entro al return");
        console.log(this.producto.comb_Descripcion, this.producto.comb_Precio, this.producto.comb_ImgUrl);
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Los campos no pueden ser vacios'
        });
              return
            }
            
              this.http.post(`${this.apiUrl}/Combo/Insertar`, this.producto)
          .subscribe( data => {
            if (data && Array.isArray(data) && data.length > 0) {
              const producto1 = data[0] as any; 
              this.comboDetalle.comb_Id = producto1.comb_Id;
            }
      
            
            this.comboDetalle.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
            this.comboDetalle.coDe_FechaCreacion = fecha;
            for(const item of this.seleccionados)
            {
              this.comboDetalle.prTa_Id = item.prTa_Id
              this.comboDetalle.coDe_Cantidad = item.cantidad
              console.log(this.comboDetalle);
              if(!(this.comboDetalle.prTa_Id && this.comboDetalle.comb_Id )) {

                if(!this.comboDetalle.prTa_Id)
                {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Debe selecionarse al menos un producto'
                  });
                }
                return
  
              }

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
              
          
          
          });
        
          },
          error: (err: any) => console.error('Error al subir imagen:', err)
        })
        
        
        
      }
  
      ngOnInit(): void {
        this.cont = 0;
        this.cont1 = 0;
        this.cont2 = 0;
      
        this.ListarProductosPorTamano();
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
      
    prueba: any[] = [];
    decrementarCantidad(prTaId: number) {
      if (!prTaId) return; 
      
      const existente = this.seleccionados.find(s => s.prTa_Id === prTaId);
      if (existente) {
        existente.cantidad -= 1;
        

        if (existente.cantidad <= 0) {
          this.seleccionados = this.seleccionados.filter(s => s.prTa_Id !== prTaId);
        }
        
        this.calcularTotal();
      }
    }

    getCantidadProducto(prTaId: number): number {
      if (!prTaId) return 0;
      
      const existente = this.seleccionados.find(s => s.prTa_Id === prTaId);
      return existente ? existente.cantidad : 0;
    }
      //municipos = new Municipios();
    
}
