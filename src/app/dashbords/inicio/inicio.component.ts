import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {CarouselModule} from 'primeng/carousel';
import { environment } from 'src/enviroments/enviroment';
import { Cliente } from 'src/app/models/clientes.model';
import { Tamano } from 'src/app/models/tamano.model';
import { Combo } from 'src/app/models/combos.model'; 
import { ComboDetalle } from 'src/app/models/comboDetalles.model';
import { ChartModule } from 'primeng/chart';
import { TotalVentasyProductosComponent } from '../total-ventasy-productos/total-ventasy-productos.component';
import { Venta } from 'src/app/models/ventas.model';
import { VentaDetalle } from 'src/app/models/ventaDetalles';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule,ButtonModule, FormsModule , CarouselModule, ChartModule, TotalVentasyProductosComponent],
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
combos2: any[] = [];

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
conteoCombos =0;
  listarCombos(): void {
  if(this.esAdmin == 'true')
  {
    this.http.post<Combo[]>(`${this.apiUrl}/Combo/MasVendidoAdmin`, { comb_FechaCreacion: this.fecha })
    .subscribe((res: any) => {

      this.combos = res.map((estado: any) => ({
        ...estado
      }));
      
      this.initCharts();
    });
  }else{
    this.http.post<Combo[]>(`${this.apiUrl}/Combo/MasVendidoEmpleado`, { comb_FechaCreacion: this.fecha, comb_Id: Number(localStorage.getItem('sucursal_id')) })
    .subscribe((res: any) => {
      this.combos = res.map((estado: any) => ({
        ...estado
      }));


      this.initCharts();
    });
   }

  }

  fecha = new Date();
  cantidadClientes: number = 0;
  conteoCombo(){
    this.http.get(`${this.apiUrl}/Combo/Listar`)
    .subscribe((res: any) => {
      this.combos2 = res.map((estado: any) => ({
       
      }));
  
      this.conteoCombos = this.combos2.length;
    });
  }
  listarCantidadClientes(): void {
  if(this.esAdmin == 'true')
  {
    this.http.post<Cliente[]>(`${this.apiUrl}/Cliente/CantidadAdmin`, { clie_FechaDato: this.fecha })
    .subscribe(
      (response) => {
 
        this.cantidadClientes = response[0].clie_Id;
     
      },
      (error) => {
        console.error('Error al obtener la cantidad de clientes:', error);
      }
    );

  }else{
    this.http.post<Cliente[]>(`${this.apiUrl}/Cliente/CantidadEmpleado`, { clie_FechaDato: this.fecha, clie_Id:  Number(localStorage.getItem('sucursal_id')) })
    .subscribe(
      (response) => {

        this.cantidadClientes = response[0].clie_Id;
    
      },
      (error) => {
        console.error('Error al obtener la cantidad de clientes:', error);
      }
    );
  }
}

  //sexo: string = '';
  ventasporsexo: any[] = [];
listarVentasPorSexo(): void {
  if(this.esAdmin == 'true')
  {
    this.http.post<VentaDetalle[]>(`${this.apiUrl}/Venta/VentaPorSexoAdmin`, { vent_Fecha: this.fecha })
    .subscribe((res: any) => {

      this.ventasporsexo = res.map((estado: any) => ({
        ...estado
      }));
      
      this.initCharts();
    });
  }else{
    this.http.post<VentaDetalle[]>(`${this.apiUrl}/Venta/VentaPorSexoEmpleado`, { vent_Fecha: this.fecha, sucu_Id: Number(localStorage.getItem('sucursal_id')) })
    .subscribe((res: any) => {
      this.ventasporsexo = res.map((estado: any) => ({
        ...estado
      }));


      this.initCharts();
    });
   }

  }

  visitorChartOptions: any;
  visitorChart: any;
  pieData: any;
  pieOptions: any;

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color');
  
    const labels = this.combos.map(combo => combo.comb_Descripcion);
    const data = this.combos.map(combo => combo.comb_Precio);

    const labelsventas = this.ventasporsexo.map(venta => venta.clie_Sexo == 'F' ? 'Femenino' : 'Masculino');
    const dataporSexo = this.ventasporsexo.map(venta => venta.veDe_Precio);
    console.log('labels ventas', labelsventas)
  
    

    this.visitorChart = {
      labels: labels,
      datasets: [
        {
          label: 'Ventas Registradas',
          data: data,
          backgroundColor: primaryColor,
          barPercentage: 0.5,
        }
      ]
    };
  
    this.visitorChartOptions = {
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: textColor,
          },
        },
      },
      responsive: true,
      scales: {
        y: {
          ticks: {
            color: textColor,
          },
          beginAtZero: true,
          grid: {
            display: false,
          },
        },
        x: {
          ticks: {
            color: textColor,
          },
          grid: {
            display: false,
          },
        },
      },
    };

    this.pieData = {
      labels: labelsventas,
      datasets: [
          {
            data: dataporSexo,
              backgroundColor: [
                   documentStyle.getPropertyValue('--purple-500'),
                  documentStyle.getPropertyValue('--indigo-500'),
                 
                 
              ],
              hoverBackgroundColor: [
                 
                  documentStyle.getPropertyValue('--purple-400'),
                  documentStyle.getPropertyValue('--indigo-400'),
                 
              ]
          }]
  };

  this.pieOptions = {
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  color: textColor
              }
          }
      }
  };

  }
  



  router = inject(Router)
  ventas: Venta[] = [];
  conteoVentas = 0;
  listarVentas(): void {
    this.http.get<Venta[]>(`${this.apiUrl}/Venta/Listar`)
      .subscribe(data => {
        this.ventas = data
        console.log('ventas', this.ventas);
        for (let index of this.ventas) {
          var fechaventa = new Date(index.vent_Fecha)
          
          //console.log(this.fecha.getMonth());
          if(fechaventa.getMonth() == this.fecha.getMonth() && fechaventa.getFullYear() == this.fecha.getFullYear()){
            this.conteoVentas++;
          }
          
        }
       
       
      });
  }
  ngOnInit(): void {
    this.listarCombos();
    this.listarCantidadClientes();
    this.conteoCombo();
    this.listarVentas();
    this.listarVentasPorSexo();
    

  }

  agregarCombo(id: number): void {
    localStorage.setItem('agregarVenta', id.toString());
    this.router.navigate(['/venta']);
  }



}

