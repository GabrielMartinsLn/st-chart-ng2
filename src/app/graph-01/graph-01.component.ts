import { Component, OnInit } from '@angular/core';

import { ChartOptions, ChartTooltipCallback } from 'chart.js';
import { Color } from 'ng2-charts';

import { Graph01Service } from './graph-01.service';

@Component({
    templateUrl: './graph-01.component.html',
    styleUrls: ['./graph-01.component.scss'],
    providers: [Graph01Service]
})
export class Graph01Component implements OnInit {
    public get selected() { return this.service.selected; }
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
    public lineChartLegend = false;
    public lineChartType = 'line';

    public lineChartPlugins = [];

    public ready: boolean;

    public lineChartOptions: ChartOptions & { annotation: any } = {
        responsive: true,
        elements: {
            point: {
                radius: 6,
                backgroundColor: 'rgba(255, 255, 232, 1)',
            },
            line: {
                // stepped: true,
                // capBezierPoints: true,
                tension: 0,
                borderWidth: 1
            },
        },
        scales: {
            xAxes: [
                {
                    id: 'x',
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 3,
                        callback: (value: string, index: number) =>{
                            return this.service.getClockTime(index);
                        },
                    },
                }
            ],
            yAxes: [
                {
                    id: 'y',
                    position: 'right',
                    ticks: {
                        suggestedMin: 400,
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
        },
        events: ['click'],
        tooltips: {
            enabled: false
        },
        onClick: (...args) => this.onClick(args[1]),
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

    onClick(item) {
        if (item.length) {
            this.service.select(item[0]._index);
        }
    }

    get finalScore() {
        return this.service.finalScore && this.service.finalScore.split(':').join('-');
    }

}
