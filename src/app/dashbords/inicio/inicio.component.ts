import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {CarouselModule} from 'primeng/carousel';
import { environment } from 'src/enviroments/enviroment';

import { Tamano } from 'src/app/models/tamano.model';
import { Combo } from 'src/app/models/combos.model'; 
import { ComboDetalle } from 'src/app/models/comboDetalles.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule , CarouselModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  private apiUrl = environment.apiUrl; 
  productos2: any[] = [];
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
  @Output() errorCrear = new EventEmitter<void>();
  uploadedFiles: any[] = [];
url = this.apiUrl;
 
esAdmin = localStorage.getItem('Admin');

 

combos: any[] = [];

carouselResponsiveOptions: any[] = [
  {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
  },
  {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
  },
  {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
  },
];

customerCarousel: any[] = [];

listarCombos(): void {
if(this.esAdmin == 'true')
{
  this.http.get(`${this.apiUrl}/Combo/MasVendido`)
  .subscribe((res: any) => {
    this.combos = res.map((estado: any) => ({
      ...estado
    }));
  });
}
else{

}


}



  router = inject(Router)

  
  ngOnInit(): void {

    this.listarCombos();


  }
  



}

