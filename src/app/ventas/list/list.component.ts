import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import { Venta } from '../../models/ventas.model'
import {VentaCreateComponent } from '../create/create.component';
import {EditComponent} from '../edit/edit.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FacturaComponent } from '../factura/factura.component';
import { DetailsComponent } from '../details/details.component';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { MenuItem } from 'primeng/api';
import { Respuesta } from 'src/app/models/respuesta.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule,AccordionModule,FacturaComponent,DetailsComponent,EditComponent, RouterModule, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule, VentaCreateComponent],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  
})

export class VentasListComponent implements OnInit {

  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];

  ventas: any[] = [];
  venta = new Venta();
 ventaSeleccionada: any;

  private http = inject(HttpClient);
  private router = inject(Router);
  showDetails = false;
  showFactura = false;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarVentas();
  }

  listarVentas(): void {
    this.http.get(`${this.apiUrl}/Venta/Listar`)
      .subscribe((res: any) => {
        this.ventas = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }


  crearAcciones(venta: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.obtenerVenta(venta.vent_Id, 1)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        command: () => this.obtenerVenta(venta.vent_Id, 2)

      },
      {
        label: 'Factura',
        icon: 'pi pi-file',
        command: () => this.obtenerVenta(venta.vent_Id, 3)

      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(venta.vent_Id)
      }
    ];
  }
  obtenerVenta(id: number, accion:number): void {
    
    this.ventaSeleccionada = id; 
    if(accion == 1)
    {
      this.showEdit = true;
    }
    else if(accion == 2)
    {
      this.showDetails = true;
    }
    else{
      this.showFactura = true;
    }
  }
  /*
   ObtenerEstadoCivil(id: number): void {
      this.estadoCivil.esCi_Id = id;
      this.http.post<EstadoCivil>(`${this.apiUrl}/EstadoCivil/Find`, this.estadoCivil)
        .subscribe(data => {
          this.estadoCivilSeleccionado = data;
          this.showEdit = true;
        });
    }
  */
  
    confirmarEliminacion(id: number): void {
      this.confirmationService.confirm({
        message: '¿Estás seguro que deseas eliminar esta Venta?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarVenta(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  
  
    EliminarVenta(id: number): void {
      this.venta.vent_Id = id;
      this.http.post<Respuesta<Venta>>(`${this.apiUrl}/Venta/Eliminar`, this.venta)
      .subscribe({
        next: (response) => {
        if (response && response.data.codeStatus >0) {
          console.log(response)
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Venta eliminado'
          });
          this.listarVentas();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo eliminar!',
            detail: 'La venta esta siendo utilizado'
          });
          this.listarVentas();
        }
      }
      });
    }
  


    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarVentas();
    }
  
    cancel(accion: number): void {
      if(accion == 1)
      {
        this.showEdit = false;
      }
      else if(accion == 2)
      {
        this.showDetails = false;
      }
      else if(accion == 3){
        this.showFactura = false;
      } 
    
      this.listarVentas();
    }

    
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarVentas();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Venta creado exitosamente'
        });
      }, 100);
    }

    registroActualizado(): void {
      this.showEdit = false;
      this.listarVentas();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'venta actualizada exitosamente'
        });
      }, 100);
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
