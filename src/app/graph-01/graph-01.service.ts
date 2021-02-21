import { Injectable } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';

import { DataService } from '../data/data.service';

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
        const firstPrice = this.pricesData[0];
        const lastPrice = this.pricesData[this.pricesData.length - 1];
        const lastIncident = this.incidentsData[this.incidentsData.length - 1];
        const arr: IncidentItem[] = [];
        arr.push({
            date: firstPrice.date,
            price: firstPrice.price,
            $$moment: firstPrice.$$moment,
            dayTimeMs: firstPrice.dayTimeMs,
            clockTime: '00:00',
            playerName: '',
            teamName: '',
            type: 'begin',
            score: '0:0',
        });
        for (const i of this.incidentsData) {
            i.price = this.getPrice(i.date);
            arr.push(i);
        }
        arr.push({
            date: lastPrice.date,
            price: lastPrice.price,
            $$moment: lastPrice.$$moment,
            dayTimeMs: lastPrice.dayTimeMs,
            clockTime: '98:00',
            playerName: '',
            teamName: '',
            type: 'end',
            score: lastIncident.score,
        });
        this.visibleData = arr;
        // console.log(arr);
    }

    on() {
        const labels = this.visibleData.map(i => i.dayTimeMs);
        const data = this.visibleData.map(i => i.price);
        this.makeData(labels, data);
    }

    makeData(labels, values) {
        // console.log({ labels });
        this.lineChartLabels = labels;
        this.lineChartData = [
            {
                label: 'Arsenal',
                data: values
            },
        ];
        this.select(0);
    }

    private getPrice(date: string | Date) {
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
        return last.price;
    }

    select(index) {
        const item = this.visibleData[index];
        this.selected = item;
        console.log({ item });
    }

    getClockTime(index) {
        const item = this.visibleData[index];
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

}
