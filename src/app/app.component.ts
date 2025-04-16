import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
    
})
export class AppComponent implements OnInit {
    private authCheckSubscription: Subscription | undefined;
    private routerSubscription: Subscription | undefined;
    constructor(private primengConfig: PrimeNGConfig, private router: Router) { }
   
    
    ngOnInit(): void {
        this.primengConfig.ripple = true;
        this.checkAuthentication();
    

        this.routerSubscription = this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
          this.checkAuthentication();
        });
        
   
        this.authCheckSubscription = interval(5000).subscribe(() => {
          this.checkAuthentication();
        });
      }
      
      checkAuthentication(): void {
        
        const usuario = localStorage.getItem('usuario');
        const empleado = localStorage.getItem('empleado');
        const rol = localStorage.getItem('rol');
        const correo = localStorage.getItem('correo');
        
        if (!usuario || !empleado || !rol || !correo) {
    
          if (!this.router.url.includes('/login') && !this.router.url.includes('/forget-password') && !this.router.url.includes('/verification-cod') && !this.router.url.includes('/reset-password')) {
            this.router.navigate(['/login']);
          }
        }
      }
      
      ngOnDestroy(): void {
    
        if (this.authCheckSubscription) {
          this.authCheckSubscription.unsubscribe();
        }
        if (this.routerSubscription) {
          this.routerSubscription.unsubscribe();
        }
      }
    }
    



