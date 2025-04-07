import { createComponent, NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DepaListComponent } from './departamentos/list/list.component';
import { DepaCreateComponent } from './departamentos/create/create.component';
import {EsCiListComponent} from './estadosCiviles/list/list.component';
import {EsCiCreateComponent} from './estadosCiviles/create/create.component';
import {CargosListComponent} from './cargos/list/list.component';
import {CargoCreateComponent} from './cargos/create/create.component';
import { SucursalListComponent } from './sucursales/list/list.component';
import { ClienteListComponent } from './clientes/list/list.component';

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
            {path: 'cargo', component: CargosListComponent,},
            {path: 'cargo/crear', component: CargoCreateComponent,},
            {path: 'sucursal', component: SucursalListComponent,},
            //crear sucursal
            {path: 'cliente', component: ClienteListComponent,},
            
            
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
