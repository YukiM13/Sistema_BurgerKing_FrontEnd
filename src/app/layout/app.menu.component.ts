import { inject, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from './service/authService.service';
import { Roles } from '../models/rol.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroment';



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
    rol_Id = new Roles();
    pantllas2: string ='';
    esAdmin = localStorage.getItem('Admin');
      private apiUrl = environment.apiUrl; 
          http = inject(HttpClient);
   
    cargarMenu(){
        
        console.log(this.esAdmin);
        const pantallas = localStorage.getItem('pantallas');
        if(pantallas){
          this.pant=pantallas.split(',');
          console.log(this.pant);
          this.tieneAcceso = this.pant.includes('Usuarios') || this.pant.includes('Roles')
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
          const subItemsAcceso = [];
          const subItemsGeneral = [];
          const subItemsVentas = [];
          if(this.pant.includes('Usuarios')){
            subItemsAcceso.push({
                label: 'Usuarios',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/usuario']
            })
          }
        if(this.pant.includes('Roles')){
                subItemsAcceso.push({
                    label: 'Roles',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/rol']
                })
        }
        if(this.pant.includes('Departamentos')){
            subItemsGeneral.push({
                label: 'Departamentos',
                icon: 'pi pi-fw pi-image',
                routerLink: ['/departamento']
            })
        }
        if(this.pant.includes('Municipios')){
            subItemsGeneral.push({
                label: 'Municipios',
                icon: 'pi pi-fw pi-list',
                routerLink: ['/municipio']
            })
        }
        if(this.pant.includes('Estados Civiles')){
            subItemsGeneral.push({
                label: 'Estados Civiles',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/estadoCivil']
            })
        }
        if(this.pant.includes('Empleados')){
            subItemsGeneral.push({
                label: 'Empleados',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/empleado']
            })
        }
        if(this.pant.includes('Cargos')){
            subItemsGeneral.push({
                label: 'Cargos',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/cargo']
            })
        }
        if(this.pant.includes('Sucursales')){
            subItemsGeneral.push({
                label: 'Sucursales',
                icon: 'pi pi-fw pi-shop',
                routerLink: ['/sucursal']
            })
        }
        if(this.pant.includes('Clientes')){
            subItemsGeneral.push({
                label: 'Clientes',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/cliente']
            })
        }
        if(this.pant.includes('Tamano')){
            subItemsVentas.push({
                label: 'Tamaño',
                icon: 'pi pi-fw pi-image',
                routerLink: ['/tamano']
            })
        }
        if(this.pant.includes('Categorias')){
            subItemsVentas.push({
                label: 'Categorias',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/categoria']
            })
        }
        if(this.pant.includes('Productos')){
            subItemsVentas.push({
                label: 'Productos',
                icon: 'pi pi-fw pi-list',
                routerLink: ['/producto']
            })
        }
        if(this.pant.includes('Combos')){
            subItemsVentas.push({
                label: 'Combos',
                icon: 'pi pi-fw pi-comments',
                routerLink: ['/combo']
            })
        }
        if(this.pant.includes('Ventas')){
            subItemsVentas.push({
                label: 'Ventas',
                icon: 'pi pi-fw pi-list',
                routerLink: ['/venta']
            })
        }
        
          if (this.tieneAcceso) {
              items.push({
                  label: 'Acceso',
                  icon: 'pi pi-fw pi-user',
                  items: subItemsAcceso
              });
          }
          
          if (this.tieneGeneral) {
              items.push({
                  label: 'General',
                  icon: 'pi pi-fw pi-globe',
                  items: subItemsGeneral
              });
          }
          
          if (this.tieneVentas) {
              items.push({
                  label: 'Ventas',
                  icon: 'pi pi-fw pi-cart-plus',
                  items: subItemsVentas
              });
          }
          
          if (items.length > 0) {
              this.model.push({
                  label: '',
                  items: items
              });
          }
                      
    }

    cargarMenuAdmin(){
        this.model = [
            {
                label: '',
                icon: '',
                items: [
                    {
                        label: 'Inicio',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    }
                
                ]
            },
            {
                
                label: '',
                items: [
                    {
                        

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
                        
                    },
                    {label: 'General',
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
                                icon: 'pi pi-fw pi-building-columns',
                                routerLink: ['/sucursal']
                            },
                            {
                                label: 'Clientes',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/cliente']
                            }, 
                        ]
                    },
                    {
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
                                icon: 'pi pi-fw pi-shopping-cart',
                                routerLink: ['/venta']
                            }
                         
                        ]
                    },
                    {
                        label: 'Reportes',
                        icon: 'pi pi-fw pi-file',
                        items: [
                            {
                                label: 'Listado de Productos',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['/reporte-listadoProductos']
                            },
                            {
                                label: 'Clientes Registrados',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['/reporte-clienteRegistrado']
                            },
                            {
                                label: 'Productos Vendidos',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['/producto']
                            },
                            {
                                label: 'Ventas por sucursal',
                                icon: 'pi pi-fw pi-file-pdf',
                                routerLink: ['/combo']

                            }
                         
                        ]
                    },
                    
                ]
            }
        ];
    
    }
    ngOnInit() {
     if(this.esAdmin == 'true'){
        this.cargarMenuAdmin();
     }else{
        const rolId = localStorage.getItem('rol_id');
    this.rol_Id.role_Id = rolId ? parseInt(rolId) : 0;
      console.log(rolId);
      this.http.post<Roles[]>(`${this.apiUrl}/RolPorPantallas/Buscar`, this.rol_Id).subscribe(data => {
        console.log(data);
        if (data ) {
          for(let i = 0; i < data.length; i++){
            this.pantllas2 += data[i].pant_Descripcion + ',';

          }
          console.log(this.pantllas2);
          localStorage.setItem('pantallas', this.pantllas2);

        }
        this.cargarMenu();
      });
    
       
    }
                        

    
 }
}

