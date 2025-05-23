  import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
  import {CommonModule, NgFor} from '@angular/common';
  import {Router} from '@angular/router';
  import {HttpClient} from '@angular/common/http';
  import {FormsModule} from '@angular/forms'
  import {Categoria} from '../../models/categorias.model'
  import { environment } from 'src/enviroments/enviroment';
  import { MessageService } from 'primeng/api';
  import { ToastModule } from 'primeng/toast';
  import { Respuesta } from '../../models/respuesta.model';
import { Button, ButtonModule } from 'primeng/button';
  @Component({
    selector: 'app-create',
    standalone: true,
    imports: [CommonModule,ButtonModule, FormsModule, ToastModule],
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
    @Output() errorCrear = new EventEmitter<void>();
  
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
      this.categoria.usua_Creacion =  Number(localStorage.getItem('usuario_id'));
      const fecha = new Date();
      this.categoria.cate_FechaCreacion = fecha;  
      this.http.post<Respuesta<Categoria>>(`${this.apiUrl}/Categoria/Insertar`, this.categoria)
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
  }
