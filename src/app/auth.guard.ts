import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Roles } from './models/rol.model';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}
  rol_Id = new Roles();
  esAdmin = false;

  private apiUrl = environment.apiUrl; 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const usuarioRaw = localStorage.getItem('usuario');
    console.log('usuarioRaw', usuarioRaw);
    if (!usuarioRaw) {
      this.router.navigate(['/']);
      return of(false);

    }
    console.log("Session",localStorage.getItem('Admin'));
    if(localStorage.getItem('Admin')== 'true'){
        this.esAdmin = true;
    }
    else
    {
      this.esAdmin = false;
    }
   

    const ruta = route.routeConfig?.path;
    const rutaAPantalla: Record<string, string> = {
      'departamento': 'Departamentos',
      'estadoCivil': 'Estados Civiles',
      'usuario': 'Usuarios',
      'rol': 'Roles',
      'municipio': 'Municipios',
      'empleado': 'Empleados',
      'tamano': 'Tamano',
      'producto': 'Productos',
      'cargo': 'Cargos',
      'sucursal': 'Sucursales',
      'cliente': 'Clientes',
      'categoria': 'Categorias',
      'venta': 'Ventas',
      'combo': 'Combos',
      '': 'Principal',
    };

    const nombrePantalla = rutaAPantalla[ruta || ''];
    if (this.esAdmin === true) {
      console.log('esAdmin', this.esAdmin);
      return of(true);
    }
    const rolId = localStorage.getItem('rol_id');
    this.rol_Id.role_Id = rolId ? parseInt(rolId) : 0;
    return this.http.post<Roles[]>(`${this.apiUrl}/RolPorPantallas/Buscar`, this.rol_Id).pipe(
      map((pantallas: Roles[]) => {
        const permitidas = pantallas.map(p => p.pant_Descripcion); 
        localStorage.setItem('pantallasPermitidas', JSON.stringify(permitidas));
        const puedeAcceder = permitidas.includes(nombrePantalla);
        if (!puedeAcceder) {
         
          this.router.navigate(['/']);
        }
        return puedeAcceder;
      }),
      catchError(() => {
       
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}