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
                                icon: 'pi pi-fw pi-image',
                                routerLink: ['/usuario']
                            },
                            {
                                label: 'Roles',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/rol']
                            }
                        ]
                    }
                ]
            },
            {
                
                label: '',
                items: [
                    {
                        

                        label: 'General',
                        icon: 'pi pi-fw pi-globe',
                        items: [
                            {
                                label: 'Departamento',
                                icon: 'pi pi-fw pi-image',
                                routerLink: ['/departamento']
                            },
                            {
                                label: 'Municipio',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/municipio']
                            },
                            {
                                label: 'Estados Civiles',
                                icon: 'pi pi-fw pi-comments',
                                routerLink: ['/estadoCivil']

                            },
                            {
                                label: 'Empleados',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/empleado']
                            }
                         
                        ]
                    }
                ]
            },
            {
                
                label: '',
                items: [
                    {
                        

                        label: 'Ventas',
                        icon: 'pi pi-fw pi-globe',
                        items: [
                            {
                                label: 'Tamaño',
                                icon: 'pi pi-fw pi-image',
                                routerLink: ['/tamano']
                            },
                            {
                                label: 'Categoria',
                                icon: 'pi pi-fw pi-image',
                                routerLink: ['/']
                            },
                            {
                                label: 'Productos',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/producto']
                            },
                            {
                                label: 'Combos',
                                icon: 'pi pi-fw pi-comments',
                                routerLink: ['/']

                            },
                            {
                                label: 'Ventas',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/']
                            }
                         
                        ]
                    }
                ]
            }
        ];
    }
}
