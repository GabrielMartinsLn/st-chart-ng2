import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import * as moment from 'moment';

import { Graph01Service } from './graph-01.service';
import { graph01Plugin } from './graph-01.pugin';

@Component({
    selector: 'app-graph-01',
    templateUrl: './graph-01.component.html',
    styleUrls: ['./graph-01.component.scss'],
    providers: [Graph01Service]
})
export class Graph01Component implements OnInit {
    public get selected() { return this.service.selected; }
    public get lineChartData() { return this.service.lineChartData; }
    public get lineChartLabels() { return this.service.lineChartLabels; }
    public lineChartLegend = false;
    public lineChartType = 'line';

    public lineChartPlugins = [graph01Plugin];

    public ready: boolean;
    public index: number;

    public lineChartOptions: ChartOptions & { graph01?: any } = {
        responsive: true,
        layout: {
            padding: {
                top: 8,
                right: 48,
            }
        },
        elements: {
            point: {
                radius: 0,
                backgroundColor: 'rgba(255, 255, 232, 1)',
            },
            line: {
                tension: 0,
                borderWidth: 1,
                stepped: true
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
                        callback: (value: string, index: number) => {
                            return moment(value).format('HH:mm');
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

    constructor(
        private service: Graph01Service,
        private currency: CurrencyPipe,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.getData();
    }

    async getData() {
        await this.service.getData(this.index);
        this.setIncreasesText();
        this.ready = true;
        this.cdr.detectChanges();
    }

    setIncreasesText() {
        this.lineChartOptions.graph01 = {
            text1: () => this.currency.transform(this.service.finalPrice / 100, 'EUR'),
            text2: () => `${this.service.periodIncrease.toFixed(1)}%`
        };
    }

    onClick(item) {
        if (item.length && item[1]) {
            this.service.select(item[1]._index);
        }
    }

    onSwipe(e) {
        if (e.deltaX > 0) {
            this.prevIndex();
        } else {
            this.nextIndex();
        }
    }

    nextIndex() {
        this.index = (this.index % 3) || 1;
        this.getData();
    }

    prevIndex() {
        this.index = this.index - 1;
        if (this.index < 1) {
            this.index = 2;
        }
        this.getData();
    }

    get finalScore() {
        return this.service.finalScore && this.service.finalScore.split(':').join('-');
    }

}
