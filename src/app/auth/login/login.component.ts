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
import { AuthService } from 'src/app/layout/service/authService.service';
import { VerificationEmailComponent } from '../verification-email/verification-email.component';
import { VerificationCodComponent } from '../verification-cod/verification-cod.component';
import { RestorePasswordComponent } from '../restore-password/restore-password.component';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, VerificationEmailComponent,RestorePasswordComponent,VerificationCodComponent,FormsModule,FileUploadModule, ConfirmDialogModule,ToastModule,DropdownModule,MultiSelectModule,DialogModule, TableModule, RouterModule],
  providers:[MessageService, ConfirmationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 
  private apiUrl = environment.apiUrl; 
      http = inject(HttpClient);
      rol_Id = new Roles();
      usuarioLogin = new Usuario();
      pantallas: string ='';
      showForgetPassword = false;
      showVerificationCod= false;
      showChangesPassword = false;
     cont = 0;
      constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService 
      ) {}

       ngOnInit(): void {
          this.cont = 0;
          const usuario = localStorage.getItem('usuario');
          const empleado = localStorage.getItem('empleado');
          const rol = localStorage.getItem('rol');
        

           if (usuario || empleado || rol ) {
             this.router.navigate(['/']);
           }
   }
    InicioSesion () {
   
      this.cont = 1;
      if (!this.usuarioLogin.usua_Usuario || !this.usuarioLogin.usua_Clave) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario y contraseña son requeridos',
        });
        return
      }

      this.http.post<Usuario[]>(`${this.apiUrl}/Usuario/Login`, this.usuarioLogin).subscribe(data => {
        if (data && data.length > 0) {
          this.usuarioLogin = data[0];
            console.log(this.usuarioLogin);
             localStorage.setItem('usuario', this.usuarioLogin.usua_Usuario);
             localStorage.setItem('empleado', this.usuarioLogin.nombreEmpleado);
             localStorage.setItem('rol', this.usuarioLogin.role_Descripcion);
             localStorage.setItem('usuario_id', this.usuarioLogin.usua_Id.toString());
             localStorage.setItem('sucursal', this.usuarioLogin.sucu_Descripcion);
             localStorage.setItem('correo', this.usuarioLogin.usua_Correo);
              localStorage.setItem('rol_id', this.usuarioLogin.role_Id.toString());
              localStorage.setItem('sucursal_id', this.usuarioLogin.sucu_Id.toString());
              const adminValue = this.usuarioLogin.usua_Admin.toString();
              
              console.log(localStorage.getItem('sucursal_id'));
              // if(adminValue == '1'){
              //   localStorage.setItem('Admin', 'true');
              // }
              // else if(adminValue == '0'){
              
              //   localStorage.setItem('Admin', 'false');
              // }
              localStorage.setItem('Admin', 'true');
             
              console.log(localStorage.getItem('Admin'));
            const rolId = localStorage.getItem('rol_id');
          this.rol_Id.role_Id = rolId ? parseInt(rolId) : 0;
            console.log(rolId);
            this.http.post<Roles[]>(`${this.apiUrl}/RolPorPantallas/Buscar`, this.rol_Id).subscribe(data => {
              console.log(data);
              if (data ) {
                for(let i = 0; i < data.length; i++){
                  this.pantallas += data[i].pant_Descripcion + ',';

                }
                console.log(this.pantallas);
                localStorage.setItem('pantallas', this.pantallas);
              }
            });
            this.authService.notifySessionChange(); 
            this.router.navigate(['/']);

            
          }else{
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Usuario o contraseña incorrectos',
            });
          }
        });
    }

    forgetPassword(){
      this.showForgetPassword = true;
    }

    cancelar(accion: number){
      if(accion == 1){
        this.showForgetPassword = false;

      }
      else if(accion == 2)
      {
        this.showVerificationCod = false;
      }
      else if(accion == 3)
      {
        this.showChangesPassword = false;
      }
     
    }

    UsurioEnviado(accion: number){
      if(accion == 1){
        this.showForgetPassword = false;
        this.showVerificationCod = true;

      }
      else if(accion == 2)
      {
        this.showVerificationCod = false;
        this.showChangesPassword = true;
      }
      else if(accion == 3)
      {
        this.showChangesPassword = false;
        
      }
    
    }
}
