import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent {
    date: Date= new Date();
    constructor(public layoutService: LayoutService, public router: Router) { }
    usuario = '';
    correo = '';
    empleado = '';
    get visible(): boolean {
        return this.layoutService.state.rightMenuActive;
    }

    set visible(_val: boolean) {
        this.layoutService.state.rightMenuActive = _val;
    }
    ngOnInit() {
        this.usuario = localStorage.getItem('usuario') || '';
        this.correo = localStorage.getItem('correo') || '';
        this.empleado = localStorage.getItem('empleado') || '';
    }

    cierreSesion() {
        console.log('Cerrando sesión...');
        localStorage.clear();
        localStorage.removeItem('usuario_id');
        localStorage.removeItem('usuario');
        localStorage.removeItem('empleado');
        localStorage.removeItem('rol');
        localStorage.removeItem('correo');
        localStorage.removeItem('sucursal');
        localStorage.removeItem('rol_id');
        localStorage.removeItem('Admin');
        this.router.navigate(['/login']);   
    }
}