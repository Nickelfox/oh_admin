import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ChartColor, ChartDatasets, ChartLabel, ChartOptions } from '@rinminase/ng-charts';

@Component({
  selector: 'hidden-innovation-line-chart',
  template: `
    <ng-template [ngIf]='isLoading' [ngIfElse]='statsLoadingElse'>
      <hidden-innovation-shimmer
        [rounded]='true'
        class='mb-2'
        height='500px'
        width='100%'
      ></hidden-innovation-shimmer>
    </ng-template>
    <ng-template #statsLoadingElse>
      <mat-card>
        <mat-card-content>
          <div class='d-flex align-items-center mb-3'>
            <mat-icon color='primary' class='mr-1 card-icon'>{{icon || '--'}}</mat-icon>
            <h4 class='mat-h4 mb-0 text-color__primary font-calibri'>{{label || '--'}}</h4>
          </div>
          <div class='chart__container-main'>
            <canvas baseChart
                    chartType='line'
                    [colors]='chartColors'
                    [datasets]='chartData'
                    [labels]='chartLabels'
                    [legend]='chartLegend'
                    [options]='chartOptionType(chartOpt)'
            >
            </canvas>
            <div *ngIf='noDataCheck' class='d-flex align-items-center justify-content-center chart__no-data-con'>
              <h3 class='mat-h3'>No Data Available</h3>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </ng-template>
  `,
  styleUrls: ['./line-chart.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent {

  @Input() chartLabels: ChartLabel[] = [];
  @Input() chartData: ChartDatasets = [];
  @Input() label?: string;
  @Input() icon?: string;
  @Input() isLoading?: boolean | null;
  @Input() chartOpt?: string;


  // chartOptions: ChartOptions = {
  //   layout: {
  //     padding: 0
  //   },
  //   elements: {
  //     line: {
  //       tension: 0,
  //       borderWidth: 3
  //     },
  //     point: {
  //       pointStyle: 'circle',
  //       radius: 4,
  //       hoverRadius: 8
  //     }
  //   },
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   title: {
  //     display: true,
  //     position: 'left',
  //     text: this.getChartTitle(),
  //     fontColor: '#394155',
  //     fontSize: 10,
  //     padding: 5
  //   },
  //
  // };


  chartColors: ChartColor = [
    {
      backgroundColor: 'transparent',
      borderColor: '#CADF6E ',
      pointBackgroundColor: '#367AEC',
      pointBorderColor: '#CADF6E',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#367AEC'
    }
  ];

  chartLegend = false;

  get noDataCheck(): boolean {
    try {
      return !this.chartData[0].data?.length;
    } catch {
      return false;
    }
  }

  chartOptionType(type?: string): ChartOptions {
    return {
      layout: {
        padding: 0
      },
      elements: {
        line: {
          tension: 0,
          borderWidth: 3
        },
        point: {
          pointStyle: 'circle',
          radius: 4,
          hoverRadius: 8
        }
      },
      tooltips:{
        titleSpacing: 20,
        // bodyAlign: "center",
        titleFontSize: 14,
        titleMarginBottom: 10,
        xPadding: 10,
        yPadding: 10,
        callbacks:{
          label(tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData): any {
            // @ts-ignore
            const value = data.datasets[0].data[tooltipItem.index];
            return `  ${value}`;
          }
        }
      },

      responsive: true,
      maintainAspectRatio: true,
      title: {
        display: true,
        position: 'left',
        text: type,
        fontColor: '#394155',
        fontSize: 10,
        padding: 5
      }
    };
  }

  getChartTitle(): string {
    // console.log(data)
    switch (this.label) {
      case 'Registered Users':
        return ('No of Registered');
      default:
        return ('No of  users');
    }
  }

  ngOnInit() {
  }
}
