import { Component, OnInit } from '@angular/core';

import { ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { Graph01Service } from './graph-01.service';

@Component({
    templateUrl: './graph-01.component.html',
    styleUrls: ['./graph-01.component.scss'],
    providers: [Graph01Service]
})
export class Graph01Component implements OnInit {
    public get lineChartData() { return this.service.lineChartData; }
    public get lineChartLabels() { return this.service.lineChartLabels; }
    // public lineChartOptions: (ChartOptions | { annotation: any }) = {
    //     responsive: true,
    // };
    // public lineChartColors: Color[] = [
    //     {
    //         borderColor: 'black',
    //         backgroundColor: 'rgba(255,0,0,0.3)',
    //     },
    // ];
    public lineChartLegend = true;
    public lineChartType = 'line';

    public lineChartPlugins = [];

    public ready: boolean;

    public lineChartOptions: ChartOptions & { annotation: any } = {
        responsive: true,
        elements: {
            point: {
                radius: 0
            },
            line: {
                stepped: true,
                borderWidth: 1
            }
        },
        scales: {
            xAxes: [
                {
                    id: 'x',
                    ticks: {
                        autoSkipPadding: 100,
                        maxRotation: 0,
                        callback(value: string) {
                            const timeParts = value.split(' ')[1].split(':');
                            return `${timeParts[0]}:${timeParts[1]}`;
                        }
                    }
                }
            ],
            yAxes: [
                {
                    id: 'y',
                    ticks: {
                        callback: (value: number) => {
                            return `\u20AC${(value / 100).toFixed(2)}`;
                        }
                    }
                }
            ]
        },
        annotation: {
            annotations: [
                {
                    display: true,
                    type: 'line',
                    scaleID: 'y',
                    mode: 'horizontal',
                    value: 430,
                    borderColor: 'red',
                    borderWidth: 2,
                    label: {
                        enabled: true,
                        content: 'hello',
                        fontColor: 'orange'
                    }
                },
                {
                    type: 'point',
                    yValue: 500,
                    display: true,
                    radius: 20
                }
            ]
        }
    };
    public lineChartColors: Color[] = [
        {
            borderColor: 'rgba(14,161,232,1)',
            backgroundColor: 'rgba(14,161,232,0.07)'
        }
    ];

    constructor(private service: Graph01Service) { }

    ngOnInit() {
        this.getData();
    }

    async getData() {
        await this.service.getData();
        this.ready = true;
    }

}
