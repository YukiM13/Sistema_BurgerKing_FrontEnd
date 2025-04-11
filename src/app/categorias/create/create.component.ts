  import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
  import {CommonModule, NgFor} from '@angular/common';
  import {Router} from '@angular/router';
  import {HttpClient} from '@angular/common/http';
  import {FormsModule} from '@angular/forms'
  import {Categoria} from '../../models/categorias.model'
  import { environment } from 'src/enviroments/enviroment';
  import { MessageService } from 'primeng/api';
  import { ToastModule } from 'primeng/toast';

  @Component({
    selector: 'app-create',
    standalone: true,
    imports: [CommonModule, FormsModule, ToastModule],
    providers: [MessageService],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss'
  })



  export class CategoriaCreateComponent {
    private apiUrl = environment.apiUrl; 
    //estadosCivil2: any[] = [];
    
    constructor(private messageService: MessageService) { }

    http = inject(HttpClient);
    @Output() cancelar = new EventEmitter<void>();  
    @Output() creado = new EventEmitter<void>();
  
    cont = 0;

    ngOnInit(): void {
      this.cont = 0;
    }




    cancelarFormulario() {
      this.cancelar.emit();  
    }
    router = inject(Router)
    categoria = new Categoria();
    crearCategoria()  {
      this.cont = 1;
      if(!this.categoria.cate_Descripcion.trim()) 
      {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: 'Campos Vacios.'
        });

        return;
      }
      this.categoria.usua_Creacion = 2;
      const fecha = new Date();
      this.categoria.cate_FechaCreacion = fecha;  
      this.http.post(`${this.apiUrl}/Categoria/Insertar`, this.categoria)
      .subscribe(() => {
        this.creado.emit();
      }

      );
      
      
      
    }
  }
