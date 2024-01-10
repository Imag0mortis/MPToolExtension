import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { RequestService } from '../shared/services/request.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  ChartComponent,
} from 'ng-apexcharts';
import { interval } from 'rxjs';

export type ChartOptions = {
  series: any;
  chart: any;
  xaxis: any;
  stroke: any;
  dataLabels: any;
  markers: any;
  tooltip: any;
  yaxis: any;
  grid: any;
  legend: any;
  title: any;
  toolbar: any;
};

declare const chrome: any;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  catalogInfo: any[] = [];
  requestInfo: any[] = [];
  activeItemIndex = 0;
  @ViewChild('chart')
  chart!: ChartComponent;
  @ViewChild('apexcharts-toolbar') apexchartsToolbar: any;
  public chartOptionsOrders!: Partial<ChartOptions>;
  public chartOptionsPrices!: Partial<ChartOptions>;
  sku: string | null = null;
  ordersX: any;
  ordersY: any;
  stocksX: any;
  stocksY: any;
  pricesX: any;
  pricesY: any;
  revenuesX: any;
  revenuesY: any;
  revenueTotal: any;
  salesTotal: any;
  wtf = interval(500);
  word= '';
  link= '';
  rank= 0;
  lastStockValue: any;
  fullPriceValue: any;
  recievedPrice: any;


  constructor(private request: RequestService, private el: ElementRef, private route: ActivatedRoute, private router: Router) {
    chrome.runtime.onMessage.addListener((message: { price: any; }, sender: any, sendResponse: any) => {
      if (message.price) {
        this.recievedPrice = message.price;
      }
    });
    chrome.tabs.onUpdated.addListener((tabId: any, changeInfo: { status: string; }, tab: any) => {
      if (changeInfo.status === 'complete') {
        this.getSku();
      }
    });
  
    this.getSku();
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const sku = params.get('sku');
      if (sku) {
        this.sku = sku;
        this.getSku();
      }
    });
  }
  

  onTabSelect(index: number) {
    this.activeItemIndex = index;
  }

  getSku() {
    if (chrome && chrome.tabs) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs: { url: any }[]) => {
          if (tabs && tabs[0] && tabs[0].url) {
            const currentUrl = tabs[0].url;
            const parts = currentUrl.split('/');
            this.sku = parts[parts.length - 2];
            if (this.sku) {
              this.postData();
            } else {
              console.error('SKU не был получен');
            }
          }
        }
      );
    } else {
      console.error('Chrome API не доступен');
    }
  }

  postData() {
    if (this.sku) {
      this.request.postReleaseData(this.sku).subscribe(
        (response: any) => {
          
          this.ordersX = response[0].orders.map((item: any) => {
            const date = new Date(item.x);
            return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' }).toLowerCase()} `;
          });
          this.ordersY = response[0].orders.map((item: any) => item.y);
          this.stocksY = response[0].stocks.map((item: any) => item.y);
          this.pricesX = response[0].prices.map((item: any) => {
            const date = new Date(item.x);
            return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' }).toLowerCase()} `;
          });
          this.pricesY = response[0].prices.map((item: any) => item.y);
          
          this.revenuesY = response[0].revenues.map((item: any) => item.y);
          this.salesTotal = response[0].sales;
          this.revenueTotal = response[0].revenue;
          const lastStockValue = this.stocksY[this.stocksY.length - 1];
          this.lastStockValue = lastStockValue;
          const fullPriceValue = this.pricesY[this.pricesY.length - 1];
          this.fullPriceValue = fullPriceValue;

          this.chartOptionsOrders = {
            series: [
              {
                name: 'Заказы',
                type: 'line', // График "Заказы" как линейный график
                data: this.ordersY,
                yAxisIndex: 0,
              },
              {
                name: 'Остатки',
                type: 'line', // График "Остатки" как линейный график
                data: this.stocksY,
                yAxisIndex: 1,
              },
            ],
            chart: {
              height: 300,
              type: 'line',
              locales: [{
                "name": "ru",
                "options": {
                  "toolbar": {
                      "exportToSVG": "Скачать SVG",
                      "exportToPNG": "Скачать PNG",
                      "exportToCSV": "Скачать CSV",
                      "menu": "Меню",
                      "selection": "Выбор",
                      "selectionZoom": "Выбранный промежуток",
                      "zoomIn": "Приблизить",
                      "zoomOut": "Отдалить",
                      "pan": "Панорамирование",
                      "reset": "Сбросить приближение"
                  }
                }
              }],
              defaultLocale: "ru"
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              width: [2, 2],
              curve: 'straight',
              dashArray: [0, 8, 5],
            },
            title: {
              text: 'Page Statistics',
              align: 'left',
            },
            legend: {
              tooltipHoverFormatter: function (
                val: string,
                opts: {
                  w: {
                    globals: { series: { [x: string]: { [x: string]: string } } };
                  };
                  seriesIndex: string | number;
                  dataPointIndex: string | number;
                }
              ) {
                return (
                  val +
                  ' - <strong>' +
                  opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                  '</strong>'
                );
              },
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6,
              },
            },
            xaxis: {
              labels: {
                trim: false,
                maxHeight: 70,
              },
              categories: this.ordersX,
            },
            yaxis: [
              {
                title: {
                  text: 'Заказы',
                  margin: 0,
                  offsetX: 0,
                  offsetY: 0,
                  floating: false,
                  style: {
                    fontSize:  '14px',
                    fontWeight:  'bold',
                    fontFamily:  undefined,
                    color:  '#008FFB'
                  },
                },
                labels: {
                  style: {
                    colors: '#008FFB', // Цвет лейбла "Заказы"
                  },
                },
              },
              {
                opposite: true,
                title: {
                  text: 'Остатки',
                  margin: 0,
                  offsetX: 0,
                  offsetY: 0,
                  floating: false,
                  style: {
                    fontSize:  '14px',
                    fontWeight:  'bold',
                    fontFamily:  undefined,
                    color:  '#00E396'
                  },
                },
                labels: {
                  style: {
                    colors: '#00E396', // Цвет лейбла "Остатки"
                  },
                },
              },
            ],
            tooltip: {
              y: [
                {
                  title: {
                    formatter: function (val: string) {
                      return val + ' (шт)';
                    },
                  },
                },
                {
                  title: {
                    formatter: function (val: string) {
                      return val + '';
                    },
                  },
                },
                {
                  title: {
                    formatter: function (val: any) {
                      return val;
                    },
                  },
                },
              ],
            },
            grid: {
              borderColor: '#f1f1f1',
            },
          };
          
          this.chartOptionsPrices = {
            series: [
              {
                name: 'Цена',
                type: 'line', // График "Цена" как линейный график
                data: this.pricesY,
              },
              {
                name: 'Выручка',
                type: 'line', // График "Выручка" как линейный график
                data: this.revenuesY,
              },
            ],
            chart: {
              height: 300,
              type: 'line',
              locales: [{
                "name": "ru",
                "options": {
                  "toolbar": {
                      "exportToSVG": "Скачать SVG",
                      "exportToPNG": "Скачать PNG",
                      "exportToCSV": "Скачать CSV",
                      "menu": "Меню",
                      "selection": "Выбор",
                      "selectionZoom": "Выбранный промежуток",
                      "zoomIn": "Приблизить",
                      "zoomOut": "Отдалить",
                      "pan": "Панорамирование",
                      "reset": "Сбросить приближение"
                  }
                }
              }],
              defaultLocale: "ru"
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              width: [2, 2], // Ширина линии для "Цены" и "Выручки"
              curve: 'straight',
              dashArray: [0, 8, 5],
            },
            title: {
              text: 'Page Statistics',
              align: 'left',
            },
            legend: {
              tooltipHoverFormatter: function (
                val: string,
                opts: {
                  w: {
                    globals: { series: { [x: string]: { [x: string]: string } } };
                  };
                  seriesIndex: string | number;
                  dataPointIndex: string | number;
                }
              ) {
                return (
                  val +
                  ' - <strong>' +
                  opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
                  '</strong>'
                );
              },
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6,
              },
            },
            xaxis: {
              labels: {
                trim: false,
                maxHeight: 70,
                style: {
                  fontSize: '12px',
              },
              },
              categories: this.pricesX,
            },
            yaxis: [
              {
                title: {
                  text: 'Цена',
                  margin: 0,
                  offsetX: 0,
                  offsetY: 0,
                  floating: false,
                  style: {
                    fontSize:  '12px',
                    fontWeight:  'bold',
                    fontFamily:  undefined,
                    color:  '#008FFB'
                  },
                },
                labels: {
                  style: {
                    colors: '#008FFB', // Цвет лейбла "Цена"
                  },
                },
              },
              {
                opposite: true,
                title: {
                  text: 'Выручка',
                  margin: 0,
                  offsetX: 0,
                  offsetY: 0,
                  floating: false,
                  style: {
                    fontSize:  '14px',
                    fontWeight:  'bold',
                    fontFamily:  undefined,
                    color:  '#00E396'
                  },
                },
                labels: {
                  style: {
                    colors: '#00E396',
                  },
                },
              },
            ],
            tooltip: {
              y: [
                {
                  title: {
                    formatter: function (val: string) {
                      return val + ' (в рублях)';
                    },
                  },
                },
                {
                  title: {
                    formatter: function (val: string) {
                      return val + ' за месяц';
                    },
                  },
                },
                {
                  title: {
                    formatter: function (val: any) {
                      return val;
                    },
                  },
                },
              ],
            },
            grid: {
              borderColor: '#f1f1f1',
            },
          };
          
        },
        (error: any) => {
          console.error('Ошибка при отправке POST-запроса:', error);
        }
      );

      this.request.postCatgalogPositionData(this.sku).subscribe(
        (response: any) => {
          this.catalogInfo = response.word_ranks;
        },
        (error: any) => {
          console.error('Ошибка при отправке POST-запроса:', error);
        }
      );

      this.request.postRealPositionData(this.sku).subscribe(
        (response: any) => {
          this.requestInfo = response.page_ranks; 
        },
        (error: any) => {
          console.error('Ошибка', error);
        }
      );
    }
  }
}