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

export interface IncidentItem {
    clockTime: string;
    date: string;
    type: string;
    teamName: string;
    playerName: string;
    score: string;
    price?: number;
    dayTimeMs?: number;
    $$moment?: moment.Moment;
}

export type GraphPeriod = 'month' | 'all';

@Injectable()
export class Graph01Service {
    public lineChartData: ChartDataSets[];
    public lineChartLabels: Label[];

    public selected: IncidentItem;

    private pricesData: PriceItem[];
    private incidentsData: IncidentItem[];
    private visibleData: IncidentItem[];

    constructor(private dataService: DataService) { }

    async getData() {
        this.pricesData = await this.dataService.getPrices();
        this.incidentsData = await this.dataService.getIncidents();
        this.onData();
    }

    onData() {
        this.parseDates(this.pricesData);
        this.parseDates(this.incidentsData);
        this.merge();
        this.on();
    }

    parseDates(arr: any) {
        for (const i of arr) {
            i.dayTimeMs = +moment(i.date).toDate();
            i.$$moment = moment(i.date);
        }
    }

    merge() {
        for (const i of this.incidentsData) {
            i.price = this.getPrice(i.date);
        }
        console.log(this.incidentsData);
    }

    on() {
        // if (!Array.isArray(this.visibleData) || !this.visibleData.length) {
        //     this.makeData([], []);
        //     return;
        // }
        const labels = this.incidentsData.map(i => i.dayTimeMs);
        const data = this.incidentsData.map(i => i.price);
        this.makeData(labels, data);
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

    private getPrice(date: string | Date) {
        const t = moment(date);
        let last: PriceItem;
        for (const p of this.pricesData) {
            if (!last) {
                last = p;
                continue;
            }
            if (p.$$moment.isAfter(last.$$moment) && p.$$moment.isSameOrAfter(t)) {
                last = p;
            }
        }
        return last.price;
    }

    select(index) {
        const item = this.incidentsData[index];
        this.selected = item;
        console.log({ item });
    }



}
