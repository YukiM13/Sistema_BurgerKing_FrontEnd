import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Dashboards',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'E-Commerce',
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
                    {
                        

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
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/venta']
                            }
                         
                        ]
                    }
                ]
            }
        ];
    }
}
