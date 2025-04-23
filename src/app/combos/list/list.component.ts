import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import { Combo } from '../../models/combos.model'
import { CombosCreateComponent } from '../create/create.component'; 
import {EditComponent} from '../edit/edit.component';
import { ComboDetailsComponent} from  '../details/details.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ComboDetalle } from 'src/app/models/comboDetalles.model';


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
  imports: [CommonModule,EditComponent, RouterModule, SplitButtonModule, ComboDetailsComponent,
     ButtonModule,ConfirmDialogModule,ToastModule, TableModule, InputTextModule,CombosCreateComponent],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
 
})

export class CombosListComponent implements OnInit {

  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  showDetails = false;
  loading = [false, false, false, false];
  comboSeleccionado: any;
  combos: any[] = [];
  combo = new Combo();
  url =  this.apiUrl;
  comboDetalle = new ComboDetalle();
  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarCombos();
  }

  listarCombos(): void {
    this.http.get(`${this.apiUrl}/Combo/Listar`)
      .subscribe((res: any) => {
        this.combos = res.map((estado: any) => ({
          ...estado,
          acciones: this.crearAcciones(estado)
        }));
      });
  }


  crearAcciones(combo: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        //command: () => this.ObtenerEstadoCivil(cargo.car)
      },
      {
        label: 'Detalles',
        icon: 'pi pi-eye',
        // Puedes añadir lógica si se desea
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.confirmarEliminacion(combo.comb_Id)
      }
    ];
  }

  ObtenerCombo(id: number, accion: number): void {
    
    this.comboSeleccionado = id; 
    if(accion == 1)
    {
      this.showEdit = true;
    }
    else
    {
      this.showDetails = true;
    }
    
  }
  
  
    confirmarEliminacion(id: number): void {
      this.confirmationService.confirm({
        message: '¿Estás seguro que deseas eliminar este Combo?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarCombo(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  
  
    EliminarCombo(id: number): void {
      this.combo.comb_Id = id;
      this.http.post<Respuesta<Combo>>(`${this.apiUrl}/Combo/Eliminar`, this.combo)
     
      .subscribe({ 
        next: (response) => {
          if (response && response.data.codeStatus >0) {
            console.log(response)
  
           
            
                  console.log(response)
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Combo eliminado'
                  });
                  this.listarCombos();
               
          }
          else
          {
            console.log(response)
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo eliminar el combo'
                  });
                  this.listarCombos();
          }
    },
     
      })
        
  
    }

    toggleCreate(): void {
      this.showCreate = !this.showCreate;
    }
  
    cancelCreate(): void {
      this.showCreate = false;
      this.listarCombos();
    }
  
    cancelEdit(): void {
      this.showEdit = false;
      this.listarCombos();
    }
    cancelDetails(): void {
      this.showDetails = false;
      this.listarCombos();
    }
  
    registroCreado(): void {
      this.showCreate = false;
      this.listarCombos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'Combo creado exitosamente'
        });
      }, 100);
    }

    crearError(): void {
      this.showCreate = false;
      this.listarCombos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El combo no se pudo crear'
        });
      }, 100);
    }


    EditarError(): void {
      this.showEdit = false;
      this.listarCombos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El combo no se pudo editar'
        });
      }, 100);
    }
    registroActualizado(): void {
      this.showEdit = false;
      this.listarCombos();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exito',
          detail: 'El combo fue actualizado exitosamente'
        });
      }, 100);
    }
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}

