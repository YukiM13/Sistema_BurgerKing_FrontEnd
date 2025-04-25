import { createComponent, NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DepaListComponent } from './departamentos/list/list.component';
import { DepaCreateComponent } from './departamentos/create/create.component';
import {EsCiListComponent} from './estadosCiviles/list/list.component';
import {EsCiCreateComponent} from './estadosCiviles/create/create.component';
import {UsuaListComponent} from './usuarios/list/list.component';
import {RoleListComponent} from './roles/list/list.component';
import {MuniListComponent} from './municipios/list/list.component';
import { EmpleListComponent } from './empleados/list/list.component';
import { TamaListComponent } from './tamano/list/list.component';
import { ProduListComponent } from './productos/list/list.component';


import {CargosListComponent} from './cargos/list/list.component';
import {CargoCreateComponent} from './cargos/create/create.component';
import { SucursalListComponent } from './sucursales/list/list.component';
import { SucursalCreateComponent } from './sucursales/create/create.component';
import { ClienteListComponent } from './clientes/list/list.component';
import { CategoriasListComponent } from './categorias/list/list.component';
import { VentasListComponent } from './ventas/list/list.component';
import { CombosListComponent } from './combos/list/list.component';
import { LoginComponent } from './auth/login/login.component';

import { InicioComponent } from './dashbords/inicio/inicio.component'; 
import { AuthGuard } from './auth.guard';
import { ListadoProductosComponent } from './reportes/listado-productos/listado-productos.component';
import { ClientesRegistradosComponent } from './reportes/clientes-registrados/clientes-registrados.component';


const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    { path: 'inicio', component: AppLayoutComponent },
  
    { path: 'login', component: LoginComponent },

  
    {
      path: '',component: AppLayoutComponent,
      children: [
        {path: '', component:InicioComponent },
        { path: 'departamento', component: DepaListComponent, canActivate: [AuthGuard]} ,
        { path: 'estadoCivil', component: EsCiListComponent, canActivate: [AuthGuard] },
        { path: 'usuario', component: UsuaListComponent, canActivate: [AuthGuard] },
        { path: 'rol', component: RoleListComponent, canActivate: [AuthGuard]},
        { path: 'municipio', component: MuniListComponent, canActivate: [AuthGuard]},
        { path: 'empleado', component: EmpleListComponent, canActivate: [AuthGuard] },
        { path: 'tamano', component: TamaListComponent, canActivate: [AuthGuard] },
        { path: 'producto', component: ProduListComponent, canActivate: [AuthGuard] },
        { path: 'cargo', component: CargosListComponent, canActivate: [AuthGuard] },
        { path: 'sucursal', component: SucursalListComponent, canActivate: [AuthGuard] },
        { path: 'cliente', component: ClienteListComponent, canActivate: [AuthGuard] },
        { path: 'categoria', component: CategoriasListComponent, canActivate: [AuthGuard] },
        { path: 'venta', component: VentasListComponent, canActivate: [AuthGuard] },
        { path: 'combo', component: CombosListComponent, canActivate: [AuthGuard] },
        {path: 'reporte-listadoProductos', component: ListadoProductosComponent},
        {path: 'reporte-clienteRegistrado', component: ClientesRegistradosComponent},

      ]

  
    },
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]

    
})
export class AppRoutingModule { }
