import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
    templateUrl: './graph-01.component.html',
    styleUrls: ['./graph-01.component.scss']
})
export class Graph01Component implements OnInit {
    data: any[];

    public lineChartData: ChartDataSets[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    ];
    public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions: (ChartOptions | { annotation: any }) = {
        responsive: true,
    };
    public lineChartColors: Color[] = [
        {
            borderColor: 'black',
            backgroundColor: 'rgba(255,0,0,0.3)',
        },
    ];
    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartPlugins = [];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.getData();
    }

    async getData() {
        this.data = await this.dataService.getIncidents();
    }

}
