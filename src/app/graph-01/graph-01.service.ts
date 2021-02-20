import { Injectable } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';

import { DataService } from '../data/data.service';

export interface PriceItem {
    date: string;
    price: number;
    $$moment?: moment.Moment;
}

export type GraphPeriod = 'month' | 'all';

@Injectable()
export class Graph01Service {
    public lineChartData: ChartDataSets[];
    public lineChartLabels: Label[];

    private period: GraphPeriod = 'month';
    private allData: PriceItem[];
    private visibleData: PriceItem[];

    constructor(private dataService: DataService) { }

    async getData(xSelector: GraphPeriod = 'all') {
        this.allData = await this.dataService.getPrices();
        this.onData();
    }

    onData() {
        this.parseData();
        this.filter();
        this.onPrices(this.visibleData);
    }

    parseData() {
        for (const i of this.allData) {
            i.$$moment = moment(i.date);
        }
    }

    filter() {
        const now = moment();
        if (this.period === 'month') {
            this.visibleData = this.allData.filter(i => i && i.date && i.$$moment.isSame(now, 'month'));
        } else {
            this.visibleData = this.allData;
        }
    }

    onPrices(res: PriceItem[]) {
        if (!Array.isArray(res) || !res.length) {
            this.makeData([], []);
            return;
        }
        const labels = res.map(point => point.date);
        const data = res.map(point => point.price);
        this.makeData(labels, data);
        // this.makeData(labels, [10, 11, 12, 13, 25]);
        // this.makeData(labels, [65, 59, 80, 81, 56, 55, 40]);
    }

    makeData(labels, values) {
        console.log({ labels });
        this.lineChartLabels = labels;
        this.lineChartData = [
            {
                label: 'Arsenal',
                data: values
            },
        ];
    }



}
