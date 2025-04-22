import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import { environment } from 'src/enviroments/enviroment';
import { FileUploadModule } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { Respuesta } from 'src/app/models/respuesta.model';
import { Usuario } from 'src/app/models/usuario.model'; 
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-verification-cod',
  standalone: true,
  imports: [CommonModule, FormsModule,FileUploadModule, ConfirmDialogModule,ToastModule,DropdownModule,MultiSelectModule,DialogModule, TableModule, RouterModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './verification-cod.component.html',
  styleUrl: './verification-cod.component.scss'
})
export class VerificationCodComponent {
  val1: string = '';
  val2: string = '';
  val3: string = '';
  val4: string = '';
  cont = 0;
  private apiUrl = environment.apiUrl; 
      http = inject(HttpClient);
      usuario = new Usuario();
      id = 0;
      codigo = '';
       correoCensurado = '';
       correo = '';
       @Output() cancelar = new EventEmitter<void>();  
       @Output() enviado = new EventEmitter<void>(); 
      constructor(
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private router: Router,

      ) {}
      ngOnInit(): void {
        if(localStorage.getItem('idRestablecer') == null){
          this.router.navigate(['/login']);
        }
         this.correo= localStorage.getItem('correo1') ?? '';
         this.correoCensurado = this.censurarCorreo(this.correo ?? '');
        this.cont = 0;
      }
      verificarCodigo() {
   
        this.cont = 1;
        if (!this.val1 || !this.val2 || !this.val3 || !this.val4) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Los campos no pueden estar vacios',
          });
          return;
        }
        this.usuario.usua_Id = Number(localStorage.getItem('idRestablecer'));
        this.codigo= this.val1 + this.val2 + this.val3 + this.val4;
        this.usuario.usua_CodigoRestablecer = this.codigo.toUpperCase();
    
        console.log(this.usuario);
        this.http.post<Respuesta<Usuario>>(`${this.apiUrl}/Usuario/VerificarCodigo`, this.usuario).subscribe({
          next: (response) => {
          if (response && response.data.codeStatus >0) {
            console.log(response)
            localStorage.setItem('verificado', 'true');
            console.log(localStorage.getItem('verificado'));
            
            this.enviado.emit();

           
           
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Codigo Invalido',
            });
          }
        }
        }
                )  
      
      }


       censurarCorreo(correo: string): string {
         if (!correo || !correo.includes('@')) return correo;
      
         const [usuario, dominio] = correo.split('@');
      
         let visible = usuario.slice(0, 2); 
        let oculto = '*'.repeat(usuario.length - 2); 
      
        return `${visible}${oculto}@${dominio}`;
       }

       Regresar(){
        localStorage.clear();
        this.cancelar.emit();
      }
  //Usuario/VerificarCodigo
}
