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
import * as am5 from '@amcharts/amcharts5';
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_hondurasLow from "@amcharts/amcharts5-geodata/hondurasLow";
import { VentaDetalle } from 'src/app/models/ventaDetalles';
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
  const departamentosData = {
    "Francisco Morazán": { latitude: 14.0723, longitude: -87.1921 },
    "Cortés": { latitude: 15.5050, longitude: -88.0250 },
    "Atlántida": { latitude: 15.7631, longitude: -86.7964 },
    "Choluteca": { latitude: 13.3007, longitude: -87.1908 },
    "Colón": { latitude: 15.9167, longitude: -85.9500 },
    "Comayagua": { latitude: 14.4513, longitude: -87.6376 },
    "Copán": { latitude: 14.7667, longitude: -88.7833 },
    "El Paraíso": { latitude: 13.9333, longitude: -86.8500 },
    "Gracias a Dios": { latitude: 15.2000, longitude: -83.7833 },
    "Intibucá": { latitude: 14.3000, longitude: -88.1833 },
    "Islas de la Bahía": { latitude: 16.3333, longitude: -86.3333 },
    "La Paz": { latitude: 14.2167, longitude: -87.8833 },
    "Lempira": { latitude: 14.5833, longitude: -88.5833 },
    "Ocotepeque": { latitude: 14.4333, longitude: -89.1833 },
    "Olancho": { latitude: 14.6500, longitude: -86.2167 },
    "Santa Bárbara": { latitude: 14.8667, longitude: -88.2333 },
    "Valle": { latitude: 13.5333, longitude: -87.5000 },
    "Yoro": { latitude: 15.0833, longitude: -87.4500 }
  };
  setTimeout(() => {
    let markerRoot = am5.Root.new("chartdiv");
    
    markerRoot.setThemes([am5themes_Animated.new(markerRoot)]);
    
    let markerChart = markerRoot.container.children.push(
      am5map.MapChart.new(markerRoot, {
        panX: "none",
        panY: "none",
        opacity: 1,
        projection: am5map.geoMercator(),
      })
    );
    
    markerChart.set("homeZoomLevel", 1.5);
    markerChart.set("homeGeoPoint", { latitude: 14.6, longitude: -86.5 });
    
    // Crear la serie de polígonos con un campo de valor para colorear
    var polygonSeries = markerChart.series.push(
      am5map.MapPolygonSeries.new(markerRoot, {
        geoJSON: am5geodata_hondurasLow,
        valueField: "id"  // Usamos id para diferenciar departamentos
      })
    );
    
    // Configurar propiedades del template de polígonos
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      stroke: am5.color("#fff"),
      strokeWidth: 1  // Mover strokeWidth aquí
    });
    
    // Configurar colores para cada departamento
    polygonSeries.mapPolygons.template.adapters.add("fill", function(fill, target) {
      // Verificar si el target y dataItem existen
      if (!target || !target.dataItem) return am5.color("#CCCCCC");
      
      // Obtener el ID del departamento
      const id = String(target.dataItem.get("visible")); // Ensure id is a string
      if (!id) return am5.color("#CCCCCC");
      
      // Mapeo de ID a colores específicos para cada departamento
      const colorMap = {
        "HN-FM": am5.color("#FF5733"),  // Francisco Morazán
        "HN-CR": am5.color("#C70039"),  // Cortés
        "HN-AT": am5.color("#900C3F"),  // Atlántida
        "HN-CH": am5.color("#581845"),  // Choluteca
        "HN-CL": am5.color("#FFC300"),  // Colón
        "HN-CM": am5.color("#DAF7A6"),  // Comayagua
        "HN-CP": am5.color("#7D6608"),  // Copán
        "HN-EP": am5.color("#9A7D0A"),  // El Paraíso
        "HN-GD": am5.color("#F7DC6F"),  // Gracias a Dios
        "HN-IN": am5.color("#196F3D"),  // Intibucá
        "HN-IB": am5.color("#0E6251"),  // Islas de la Bahía
        "HN-LP": am5.color("#76D7C4"),  // La Paz
        "HN-LE": am5.color("#2471A3"),  // Lempira
        "HN-OC": am5.color("#154360"),  // Ocotepeque
        "HN-OL": am5.color("#7FB3D5"),  // Olancho
        "HN-SB": am5.color("#C39BD3"),  // Santa Bárbara
        "HN-VA": am5.color("#D7BDE2"),  // Valle
        "HN-YO": am5.color("#E8DAEF")   // Yoro
      };
      
      // Verificar si existe este ID en nuestro mapa
      return id && id in colorMap ? colorMap[id as keyof typeof colorMap] : am5.color("#CCCCCC");
    });
  
 
    // Hover sobre departamentos
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#64748B")
    });
    
    // Ahora agregar la serie de puntos (tu código existente)
    var pointSeries = markerChart.series.push(
      am5map.MapPointSeries.new(markerRoot, {})
    );
    
    pointSeries.bullets.push(function (_root, _series, dataItem) {
      const circle = am5.Circle.new(markerRoot, {
        radius: 6,
        stroke: am5.color("#red"),
        strokeWidth: 5,
        strokeOpacity: 0.5,
        fill: am5.color("#861d1d"),
        fillOpacity: 1,
        tooltipText: "{name}",
        cursorOverStyle: "pointer",
      });
      
      // Agregar evento de clic
      circle.events.on("click", function() {
        // Acceder a los datos del punto
        const pointData = dataItem.dataContext;
        const departamento = (pointData as { name: string }).name;
        
        // Mostrar un alert con el nombre del departamento
        alert("Has hecho clic en: " + departamento);
        
        // Alternativa: podrías usar una función personalizada en lugar de alert
        // mostrarInfoDepartamento(departamento);
      });
      
      return am5.Bullet.new(markerRoot, {
        sprite: circle
      });
    });
    
   
  
  // Añadir solo los puntos especificados en el arreglo
  this.departamentosAMostrar.forEach(departamento => {
    if (departamentosData[departamento as keyof typeof departamentosData]) {
      const coords = departamentosData[departamento as keyof typeof departamentosData];
      pointSeries.pushDataItem(
        { latitude: coords.latitude, longitude: coords.longitude },
        { name: departamento }
      );
    } else {
      console.warn(`Departamento no encontrado: ${departamento}`);
    }
  });
    
  }, 0);
}
departamentosAMostrar =[]
VentaPorDepartamento(){
  this.http.post<VentaDetalle[]>(`${this.apiUrl}/Venta/TotalVentayProductosPorDepartamento`, this.venta)
  .subscribe((res: any) => {
    this.ventaDetalle = res.map((estado: any) => ({ ...estado }));
    for(let item of this.ventaDetalle) {
      this.departamentosAMostrar.push(item.depa_Descripcion);
    }
    console.log(this.departamentosAMostrar)
  })
}
  
  ngOnInit(): void {

    this.listarTotalVentas();
   this.listarVentasyProductosPorAño()

  }
  

}
