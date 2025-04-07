import { Component,inject,OnInit } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common'
import {RouterModule} from '@angular/router'
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import { Combo } from '../../models/combos.model'
//import {CargoCreateComponent } from '../create/create.component';
//import {EsCiEditComponent} from '../edit/edit.component';
import { environment } from '../../../enviroments/enviroment'; 
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';


import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SplitButtonModule, ButtonModule,ConfirmDialogModule,ToastModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('collapse', [
      state('void', style({ height: '0px', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ]
})

export class CombosListComponent implements OnInit {

  private apiUrl = environment.apiUrl;


  showCreate = false;
  showEdit = false;
  loading = [false, false, false, false];
  comboSeleccionado: any;
  combos: any[] = [];
  combo = new Combo();


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


  crearAcciones(categoria: any): MenuItem[] {
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
        //command: () => this.confirmarEliminacion(estadoCivil.esCi_Id)
      }
    ];
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
  
  
    confirmarEliminacion(id: number): void {
      this.confirmationService.confirm({
        message: '¿Estás seguro que deseas eliminar este estado civil?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => this.EliminarEstadoCivil(id),
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'No se eliminó el registro'
          });
        }
      });
    }
  
  
    EliminarEstadoCivil(id: number): void {
      this.estadoCivil.esCi_Id = id;
      this.http.post(`${this.apiUrl}/EstadoCivil/Eliminar`, this.estadoCivil)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Estado civil eliminado'
          });
          this.listarEstadosCiviles();
        });
    }
  
*/

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

}

