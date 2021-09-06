import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  ChartColor,
  ChartDatasets,
  ChartLabel,
  ChartOptions,
} from "@rinminase/ng-charts";



@Component({
  selector: 'oh-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  chartData: ChartDatasets = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Series A" },

  ];
  chartLabels: ChartLabel[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  chartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: "y-axis-0",
          position: "right",
        },
        // {
        //   id: "y-axis-1",
        //   position: "right",
        //   gridLines: {
        //     color: "rgba(255,0,0,0.3)",
        //   },
        //   ticks: {
        //     fontColor: "rgba(255,0,0,0.3)",
        //   },
        // },
      ],
    },
    annotation: {
      annotations: [
        {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: "March",
          borderColor: "orange",
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: "orange",
            content: "LineAnno",
          },
        },
      ],
    },
  };

  chartColors: ChartColor = [

    {
      // blue
      backgroundColor: "rgba(33, 150, 243, 0.2)",
      borderColor: "rgba(33, 150, 243, 1)",
      pointBackgroundColor: "rgba(33, 150, 243, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(33, 150, 243, 1)",
    },

  ];
  chartLegend = true;


  //
  // constructor() { }

  // //
  // ngOnInit(): void {
  // }
}
