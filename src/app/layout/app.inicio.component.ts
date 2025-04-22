import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'

import { environment } from 'src/enviroments/enviroment';

import { Tamano } from 'src/app/models/tamano.model';
import { Combo } from 'src/app/models/combos.model'; 
import { ComboDetalle } from 'src/app/models/comboDetalles.model';



@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule ,],
  providers:[],
  templateUrl: './app.inicio.component.html',
  
})
export class AppInicioComponent {
private apiUrl = environment.apiUrl; 
      productos2: any[] = [];
      http = inject(HttpClient);
      @Output() cancelar = new EventEmitter<void>();  
      @Output() creado = new EventEmitter<void>();
      @Output() errorCrear = new EventEmitter<void>();
      uploadedFiles: any[] = [];
    url = this.apiUrl;
     
  

     
 
  combos: any[] = [];


  listarCombos(): void {
    this.http.get(`${this.apiUrl}/Combo/MasVendido`)
      .subscribe((res: any) => {
        this.combos = res.map((estado: any) => ({
          ...estado
        }));
      });
  }
  
  

      router = inject(Router)
  
      
      ngOnInit(): void {

        this.listarCombos();

   
      }
      



}


