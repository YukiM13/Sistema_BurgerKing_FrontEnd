import { createComponent, NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ListComponent } from './departamentos/list/list.component';
import { CreateComponent } from './departamentos/create/create.component';
import {EsCiListComponent} from './estadosCiviles/list/list.component';
import {EsCiCreateComponent} from './estadosCiviles/create/create.component';
import {UsuaListComponent} from './usuarios/list/list.component';
import {RoleListComponent} from './roles/list/list.component';
import {MuniListComponent} from './municipios/list/list.component';
import { EmpleListComponent } from './empleados/list/list.component';
import { TamaListComponent } from './tamano/list/list.component';
import { ProduListComponent } from './productos/list/list.component';



const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            {path: 'departamento', component: ListComponent},
            {path: 'departamento/crear', component: CreateComponent},
            {path: 'estadoCivil', component: EsCiListComponent,},
            {path: 'estadoCivil/crear', component: EsCiCreateComponent,},
            {path: 'usuario', component: UsuaListComponent,},
            {path: 'rol', component: RoleListComponent,},
            {path: 'municipio', component: MuniListComponent,},
            {path: 'empleado', component: EmpleListComponent,},
            {path: 'tamano', component: TamaListComponent,},
            {path: 'producto', component: ProduListComponent,},




            
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
