import { Injectable } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';

import { DataService } from '../../data/data.service';

export interface PriceItem {
    date: string;
    price: number;
    $$moment?: moment.Moment;
    dayTimeMs?: number;
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
    lastDate?: number;
    lastPrice?: number;
}

export type GraphPeriod = 'month' | 'all';

@Injectable()
export class Graph01Service {
    public lineChartData: ChartDataSets[];
    public lineChartLabels: Label[];

    public selected: IncidentItem;

    private pricesData: PriceItem[];
    private incidentsData: IncidentItem[];

    constructor(private dataService: DataService) { }

    async getData(index?: number) {
        // const [prices, incidents] = Promise.all([])
        this.pricesData = await this.dataService.getPrices(index);
        this.incidentsData = await this.dataService.getIncidents(index);
        this.onData();
    }

    private onData() {
        this.parseDates(this.pricesData);
        this.parseDates(this.incidentsData);
        const arr: IncidentItem[] = [];
        for (const i of this.incidentsData) {
            Object.assign(i, this.findNearestPricePoint(i.date));
            arr.push(i);
        }
        this.incidentsData = arr;

        this.lineChartLabels = this.pricesData.map(i => i.dayTimeMs as any);
        this.lineChartData = [
            {
                order: 1,
                label: 'Prices',
                data: this.pricesData.map(i => i.price),
                radius: 0,
                pointHoverRadius: 0,
            },
            {
                order: 2,
                label: 'Incidents',
                data: this.incidentsData.map(i => ({
                    x: i.lastDate,
                    y: i.lastPrice,
                })),
                fill: false,
                showLine: false,
                radius: 8,
                pointHitRadius: 8,
                pointHoverRadius: 8,
                pointBorderColor: '#fff',
                pointBorderWidth: 3,
                pointBackgroundColor: '#0ea1e8',
                pointHoverBackgroundColor: '#0ea1e8',
                pointHoverBorderColor: '#0e71c8',
                pointHoverBorderWidth: 3,
            }
        ];
        const lastIndex = this.incidentsData?.length - 1;
        this.select(lastIndex);
    }

    select(index) {
        const item = this.incidentsData[index];
        this.selected = item;
    }

    getClockTime(index) {
        const item = this.incidentsData[index];
        return item.clockTime;
    }

    get finalScore() {
        return Array.isArray(this.incidentsData) && this.incidentsData.length ?
            this.incidentsData[this.incidentsData.length - 1].score : null;
    }

    get initPrice() {
        return this.pricesData[0] && this.pricesData[0]?.price;
    }

    get finalPrice() {
        return this.pricesData?.length && this.pricesData[this.pricesData.length - 1]?.price;
    }

    get periodIncrease() {
        return (100 * this.finalPrice) / this.initPrice - 100;
    }


    private parseDates(arr: any) {
        for (const i of arr) {
            i.dayTimeMs = +moment(i.date).toDate();
            i.$$moment = moment(i.date);
        }
    }

    private findNearestPricePoint(date: string | Date) {
        const t = moment(date);
        let last: PriceItem;
        for (const p of this.pricesData) {
            if (!last) {
                last = p;
                continue;
            }
            if (p.$$moment.isAfter(last.$$moment) && p.$$moment.isSameOrBefore(t)) {
                last = p;
            }
        }
        return {
            lastDate: last.dayTimeMs,
            lastPrice: last.price
        };
    }

}
