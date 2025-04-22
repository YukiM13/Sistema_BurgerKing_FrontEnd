import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from './service/authService.service';



@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    constructor(private authService: AuthService) {}
    model: any[] = [];
    tieneAcceso= false;
    tieneGeneral =false;
    tieneVentas = false;
    pant: string []= [];
    cont =0;
    
    esAdmin = localStorage.getItem('Admin');
   
    cargarMenu(){
        console.log(this.esAdmin);
        const pantallas = localStorage.getItem('pantallas');
        if(pantallas){
          this.pant=pantallas.split(',');
          console.log(this.pant);
          this.tieneAcceso = this.pant.includes('Usuarios') || this.pant.includes('Roles') || this.esAdmin == 'true'
          this.tieneGeneral = this.pant.includes('Departamentos') || this.pant.includes('Municipios') || this.pant.includes('Estados Civiles') || this.pant.includes('Empleados') || this.pant.includes('Cargos') || this.pant.includes('Sucursales') || this.pant.includes('Clientes')
          this.tieneVentas = this.pant.includes('Tamano') || this.pant.includes('Categorias') || this.pant.includes('Productos') || this.pant.includes('Combos') || this.pant.includes('Ventas')
          
        }
          this.model = [];
          this.model.push({
             
                  label: '',
                  icon: '',
                  items: [
                      {
                          label: 'Inicio',
                          icon: 'pi pi-fw pi-home',
                          routerLink: ['/']
                      }
                  ]
             
          });
  
          const items = [];

          if (this.tieneAcceso) {
              items.push({
                  label: 'Acceso',
                  icon: 'pi pi-fw pi-user',
                  items: [
                      {
                          label: 'Usuarios',
                          icon: 'pi pi-fw pi-users',
                          routerLink: ['/usuario']
                      },
                      {
                          label: 'Roles',
                          icon: 'pi pi-fw pi-list',
                          routerLink: ['/rol']
                      }
                  ]
              });
          }
          
          if (this.tieneGeneral) {
              items.push({
                  label: 'General',
                  icon: 'pi pi-fw pi-globe',
                  items: [
                      {
                          label: 'Departamentos',
                          icon: 'pi pi-fw pi-image',
                          routerLink: ['/departamento']
                      },
                      {
                          label: 'Municipios',
                          icon: 'pi pi-fw pi-list',
                          routerLink: ['/municipio']
                      },
                      {
                          label: 'Estados Civiles',
                          icon: 'pi pi-fw pi-pencil',
                          routerLink: ['/estadoCivil']
                      },
                      {
                          label: 'Empleados',
                          icon: 'pi pi-fw pi-users',
                          routerLink: ['/empleado']
                      },
                      {
                          label: 'Cargos',
                          icon: 'pi pi-fw pi-pencil',
                          routerLink: ['/cargo']
                      },
                      {
                          label: 'Sucursales',
                          icon: 'pi pi-fw pi-shop',
                          routerLink: ['/sucursal']
                      },
                      {
                          label: 'Clientes',
                          icon: 'pi pi-fw pi-users',
                          routerLink: ['/cliente']
                      }
                  ]
              });
          }
          
          if (this.tieneVentas) {
              items.push({
                  label: 'Ventas',
                  icon: 'pi pi-fw pi-cart-plus',
                  items: [
                      {
                          label: 'Tamaño',
                          icon: 'pi pi-fw pi-image',
                          routerLink: ['/tamano']
                      },
                      {
                          label: 'Categorias',
                          icon: 'pi pi-fw pi-pencil',
                          routerLink: ['/categoria']
                      },
                      {
                          label: 'Productos',
                          icon: 'pi pi-fw pi-list',
                          routerLink: ['/producto']
                      },
                      {
                          label: 'Combos',
                          icon: 'pi pi-fw pi-comments',
                          routerLink: ['/combo']
                      },
                      {
                          label: 'Ventas',
                          icon: 'pi pi-fw pi-list',
                          routerLink: ['/venta']
                      }
                  ]
              });
          }
          
          if (items.length > 0) {
              this.model.push({
                  label: '',
                  items: items
              });
          }
                      
    }
    ngOnInit() {
        this.authService.sessionChange$.subscribe(() => {
        
            this.cargarMenu();
        
          });
         
    
          this.cargarMenu();
                        

                       
        }
}

