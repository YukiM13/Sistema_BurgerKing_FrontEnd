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
import { ClienteListComponent } from './clientes/list/list.component';
import { CategoriasListComponent } from './categorias/list/list.component';
import { VentasListComponent } from './ventas/list/list.component';
import { CombosListComponent } from './combos/list/list.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            {path: 'departamento', component: DepaListComponent},
            {path: 'departamento/crear', component: DepaCreateComponent},
            {path: 'estadoCivil', component: EsCiListComponent,},
            {path: 'estadoCivil/crear', component: EsCiCreateComponent,},
            {path: 'usuario', component: UsuaListComponent,},
            {path: 'rol', component: RoleListComponent,},
            {path: 'municipio', component: MuniListComponent,},
            {path: 'empleado', component: EmpleListComponent,},
            {path: 'tamano', component: TamaListComponent,},
            {path: 'producto', component: ProduListComponent,},


            {path: 'cargo', component: CargosListComponent,},
            {path: 'cargo/crear', component: CargoCreateComponent,},
            {path: 'sucursal', component: SucursalListComponent,},
            //crear sucursal
            {path: 'cliente', component: ClienteListComponent,},
            //crear cliente
            {path: 'categoria' , component: CategoriasListComponent},
            //crear categoria
            {path: 'venta', component: VentasListComponent,},
            //crear venta
            {path: 'combo', component: CombosListComponent,},


            
            
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
