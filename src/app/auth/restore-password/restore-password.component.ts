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
  selector: 'app-restore-password',
  standalone: true,
  imports: [CommonModule, FormsModule,FileUploadModule, ConfirmDialogModule,ToastModule,DropdownModule,MultiSelectModule,DialogModule, TableModule, RouterModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.scss'
})
export class RestorePasswordComponent {
  private apiUrl = environment.apiUrl; 
  contra = '';
  contraConfirmacion = '';
  cont = 0;
  cont1 = 0;
  validacion = false;
  @Output() cancelar = new EventEmitter<void>();  
  @Output() enviado = new EventEmitter<void>(); 
  http = inject(HttpClient);
      usuario = new Usuario();

      constructor(
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private router: Router,

      ) {}

  ngOnInit(): void {  
    if(localStorage.getItem('usuario') == null)
    {
      console.log("Entro al if");
      
      if( localStorage.getItem('idRestablecer') == null || localStorage.getItem('verificado') == null){
        console.log("Entro al 2 if");

        this.cancelar.emit();

      }
    }
    this.cont = 0;
    this.cont1 = 0;
    this.validacion = false;
    this.contraConfirmacion = '';
    this.contra = '';
  }

  cambioContrasena1() {
    
    this.cont = 1;
    if(!this.contra || !this.contraConfirmacion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Los campos no pueden estar vacios',
      });
      return;
    }
    else
    {
      this.cont1 = 1;
      if (this.contra === this.contraConfirmacion) {
        this.validacion = true;
      } else {
        this.validacion = false;
      }
      if(this.validacion === false)
      {
        return; 
      }
      const id = Number(localStorage.getItem('idRestablecer'));
      this.usuario.usua_Id = id;
      this.usuario.usua_Clave = this.contra;
      this.http.put<Respuesta<Usuario>>(`${this.apiUrl}/Usuario/RestablecerClave`, this.usuario).subscribe({
        next: (response) => {
          if (response && response.data.codeStatus > 0) {
            console.log(response)
            this.messageService.add({
              severity: 'success',
              summary: 'Exito',
              detail: 'Contraseña cambiada correctamente',
            });
            localStorage.removeItem('idRestablecer');
            localStorage.removeItem('verificado');
            localStorage.removeItem('correo1');
            this.enviado.emit();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al cambiar la contraseña',
            });
          }
        },
        error: (error) => {
          console.error('Error:', error);
        }
    })
    }
   
}

Regresar(){
  localStorage.removeItem('idRestablecer');
  localStorage.removeItem('verificado');
  localStorage.removeItem('correo1');
  this.cancelar.emit();
}


}
