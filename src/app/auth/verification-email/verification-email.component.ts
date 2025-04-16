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
import { Roles } from 'src/app/models/rol.model';
import { er } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-verification-email',
  standalone: true,
  imports: [CommonModule, FormsModule,FileUploadModule, ConfirmDialogModule,ToastModule,DropdownModule,MultiSelectModule,DialogModule, TableModule, RouterModule],
    providers:[MessageService, ConfirmationService],
  templateUrl: './verification-email.component.html',
  styleUrl: './verification-email.component.scss'
})
export class VerificationEmailComponent {
  private apiUrl = environment.apiUrl; 
      http = inject(HttpClient);
      usuario = new Usuario();
      id = 0;
      cont = 0;
       constructor(
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private router: Router,

            ) {}
      
    ngOnInit(): void {  
      this.cont = 0;
    }
    generarCodigo(){
      this.cont = 1;
      if (!this.usuario.usua_Usuario) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El usuario no puede estar vacio',
        });
        return;
      }

       this.http.post(`${this.apiUrl}/Usuario/GenerarCodigo`, this.usuario).subscribe(data =>{
        if(data != null && data != undefined){
         this.usuario = data as Usuario;
          this.id = this.usuario.usua_Id;
          localStorage.setItem('idRestablecer', this.id.toString());
          localStorage.setItem('correo', this.usuario.usua_Correo);
          console.log(localStorage.getItem('correo'));
          this.router.navigate(['/verification-cod']);
        }
        else{
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Usuario no encontrado',
          });
          console.log('todo mal');
        }
       })
      }
    
}
