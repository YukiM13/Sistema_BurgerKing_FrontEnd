import { Component,EventEmitter,inject,OnInit, Output } from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms'
import {CarouselModule} from 'primeng/carousel';
import { environment } from 'src/enviroments/enviroment';
import { Venta } from 'src/app/models/ventas.model';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-total-ventasy-productos',
  standalone: true,
  imports: [CommonModule, FormsModule , CarouselModule, ChartModule,DropdownModule],
  templateUrl: './total-ventasy-productos.component.html',
  styleUrl: './total-ventasy-productos.component.scss'
})
export class TotalVentasyProductosComponent {
  private apiUrl = environment.apiUrl; 
  router = inject(Router)

  productos2: any[] = [];
  http = inject(HttpClient);
  @Output() cancelar = new EventEmitter<void>();  
  @Output() creado = new EventEmitter<void>();
  @Output() errorCrear = new EventEmitter<void>();
  uploadedFiles: any[] = [];
url = this.apiUrl;
 
esAdmin = localStorage.getItem('Admin');

 

ventaDetalle: any[] = [];
ventaDetalle2: any[] = [];

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
venta = new Venta();
totalVenta=0;
totalProducto = 0;
totalVentaPorDia=0;
totalProductoPorDia=0;
  revenueChartOptions2: any;
  revenueChart2: any;

  revenueChartOptions3: any;
  revenueChart3: any;


listarTotalVentas(): void {
this.venta.vent_Fecha= new Date()
this.venta.sucu_Id = Number(localStorage.getItem("sucursal_id")) || 0;
if(this.esAdmin == 'true')
{
  this.http.post(`${this.apiUrl}/Venta/TotalVentayProductosPorMes`, this.venta)
  .subscribe((res: any) => {
    this.ventaDetalle = res.map((estado: any) => ({ ...estado }));
    for(let item of this.ventaDetalle) {
      this.totalVenta += item.veDe_Precio;
      this.totalProducto += item.veDe_Cantidad;
    }

    // Solo dentro del primer subscribe, hacés el segundo
    this.http.post(`${this.apiUrl}/Venta/TotalVentayProductosPorDia`, this.venta)
      .subscribe((res: any) => {
        this.ventaDetalle2 = res.map((estado: any) => ({ ...estado }));
        for(let item of this.ventaDetalle2) {
          this.totalVentaPorDia += item.veDe_Precio;
          this.totalProductoPorDia += item.veDe_Cantidad;
        }

  
        this.initCharts();
      });
  });
 
}
else{
  
  this.http.post(`${this.apiUrl}/Venta/TotalVentayProductosPorMesPorSucursal`, this.venta)
  .subscribe((res: any) => {
    this.ventaDetalle = res.map((estado: any) => ({ ...estado }));
    for(let item of this.ventaDetalle) {
      this.totalVenta += item.veDe_Precio;
      this.totalProducto += item.veDe_Cantidad;
    }

    this.http.post(`${this.apiUrl}/Venta/TotalVentayProductosPorDiaPorSucursal`, this.venta)
      .subscribe((res: any) => {
        this.ventaDetalle2 = res.map((estado: any) => ({ ...estado }));
        for(let item of this.ventaDetalle2) {
          this.totalVentaPorDia += item.veDe_Precio;
          this.totalProductoPorDia += item.veDe_Cantidad;
        }


        this.initCharts();
      });
  });
}


}
productoPorMeses: any[] = [];
ventaPorMeses: any [] = [];
meses: Date[] = [];
ventaDetalle3: any[] = [];
listarVentasyProductosPorAño(){
  this.venta.vent_Fecha= new Date()
this.venta.sucu_Id = Number(localStorage.getItem("sucursal_id")) || 0;
if(this.esAdmin == 'true')
{
  this.http.post(`${this.apiUrl}/VentaDetalle/TotalVentayProductosPorAnio`, this.venta)
  .subscribe((res: any) => {
    this.ventaDetalle3 = res.map((estado: any) => ({ ...estado }));
    for(let item of this.ventaDetalle3) {

      this.ventaPorMeses.push(item.veDe_Precio);
      this.productoPorMeses.push(item.veDe_Cantidad);
      this.meses.push(item.mes)
    }

    

  
        this.initCharts();
  
  });
 
}
else{
  
  this.http.post(`${this.apiUrl}/VentaDetalle/TotalVentayProductosPorAnioPorSucursal`, this.venta)
  .subscribe((res: any) => {
    this.ventaDetalle3 = res.map((estado: any) => ({ ...estado }));

    for(let item of this.ventaDetalle3) {
      this.ventaPorMeses.push(item.veDe_Precio);
      this.productoPorMeses.push(item.veDe_Cantidad);
      this.meses.push(item.mes)
      
    }
    

    


        this.initCharts();
   
  });
}
}

revenueChartOptions: any;
revenueChart: any;
productos: any;
opcionesProductos: any;
changeRevenueChart(event: any) {
  const dataSet1 = [
      [37, 34, 21, 27, 10, 18, 15],
      [31, 27, 30, 37, 23, 29, 20],
      [21, 7, 13, 3, 19, 11, 6],
      [47, 31, 35, 20, 46, 39, 25],
  ];
  const dataSet2 = [
      [31, 27, 30, 37, 23, 29, 20],
      [47, 31, 35, 20, 46, 39, 25],
      [37, 34, 21, 27, 10, 18, 15],
      [21, 7, 13, 3, 19, 11, 6],
  ];

  if (event.value.code === '1') {
      this.revenueChart.datasets[0].data = dataSet2[parseInt('0')];
      this.revenueChart.datasets[1].data = dataSet2[parseInt('1')];
      this.revenueChart.datasets[2].data = dataSet2[parseInt('2')];
      this.revenueChart.datasets[3].data = dataSet2[parseInt('3')];
  } else {
      this.revenueChart.datasets[0].data = dataSet1[parseInt('0')];
      this.revenueChart.datasets[1].data = dataSet1[parseInt('1')];
      this.revenueChart.datasets[2].data = dataSet1[parseInt('2')];
      this.revenueChart.datasets[3].data = dataSet1[parseInt('3')];
  }
}
revenueMonth: any;
selectedRevenueMonth: any;

initCharts() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  


  

  this.revenueChart = {
    labels: ['Ventas del mes'], 
    datasets: [
      {
        label: 'Ventas del mes',
        data: [this.totalVenta],
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 1
      },
      {
        label: 'Ventas de hoy',
        data: [this.totalVentaPorDia],
        backgroundColor: '#66BB6A',
        borderColor: '#43A047',
        borderWidth: 1
      }
    ]
  };


  this.revenueChartOptions = {
    indexAxis: 'x', // vertical
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: surfaceBorder,
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          stepSize: 100,
        },
        grid: {
          color: surfaceBorder,
        }
      }
    }
  };
  const nombres = ['Enero', 'Febrero', 'Marzo','Abril','Mayo', 'Junio', 'Julio','Agosto','Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const nombreMeses = []
  
  for(let item of this.meses)
  {
    var fecha = new Date(item);

   
      nombreMeses.push(nombres[fecha.getMonth()])
     
    
  }
 
  this.revenueChart2 = {
    labels: nombreMeses,
    datasets: [
        {
            label: 'Ventas',
            data: this.ventaPorMeses,
            borderColor: '#EEE500',
            pointBackgroundColor: '#EEE500',
            backgroundColor: 'rgba(121, 243, 39, 0.05)',
            fill: true,
            tension: 0.4,
        },
       
        
    ],
};
this.revenueChart3 = {
  labels: nombreMeses,
  datasets: [
      {
          label: 'Productos',
          data: this.productoPorMeses,
          borderColor: '#00D0DE',
          pointBackgroundColor: '#00D0DE',
          backgroundColor: 'rgba(8, 83, 243, 0.05)',
          fill: true,
          tension: 0.4,
      },
      
  ],
};

this.revenueChartOptions3 = {
  plugins: {
      legend: {
          labels: {
              color: textColor,
          },
      },
  },
  responsive: true,
  hover: {
      mode: 'index',
  },
  scales: {
      x: {
          ticks: {
              color: textColor,
          },
      },
      y: {
          ticks: {
              color: textColor,
              min: 0,
              max: 60,
              stepSize: 5,
          },
      },
  },
};
this.revenueChartOptions2 = {
    plugins: {
        legend: {
            labels: {
                color: textColor,
            },
        },
    },
    responsive: true,
    hover: {
        mode: 'index',
    },
    scales: {
        x: {
            ticks: {
                color: textColor,
            },
        },
        y: {
            ticks: {
                color: textColor,
                min: 0,
                max: 60,
                stepSize: 5,
            },
        },
    },
};
  this.productos = {
    labels: ['Porductos vendidos en el mes'], 
    datasets: [
      {
        label: 'Productos vendidos',
        data: [this.totalProducto],
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 1
      },
      {
        label: 'Productos vendidos hoy',
        data: [this.totalProductoPorDia],
        backgroundColor: '#66BB6A',
        borderColor: '#43A047',
        borderWidth: 1
      }
    ]
  };


  this.opcionesProductos = {
    indexAxis: 'x', // vertical
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: surfaceBorder,
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          stepSize: 100,
        },
        grid: {
          color: surfaceBorder,
        }
      }
    }
  };
}


  
  ngOnInit(): void {

    this.listarTotalVentas();
   this.listarVentasyProductosPorAño()

  }
  

}
