import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data/data.service';
import * as moment from 'moment';

@Component({
    selector: 'app-d3-graph-01',
    templateUrl: './d3-graph-01.component.html',
    styleUrls: ['./d3-graph-01.component.scss']
})
export class D3Graph01Component implements OnInit {
    private index: number;

    prices: any;
    incidents: any;
    selected: any;

    constructor(
        private dataService: DataService
    ) { }

    ngOnInit() {
        this.getData();
    }

    onSwipe(e) {
        if (e.deltaX > 0) {
            this.previous();
        } else {
            this.next();
        }
    }

    previous() {
        const nIndex = (this.index - 1) || 2;
        this.index = nIndex < 0 ? 2 : nIndex;
        this.getData();
    }

    next() {
        const nIndex = (this.index + 1) || 1;
        this.index = nIndex % 3;
        this.getData();
    }

    async getData() {
        this.prices = await this.dataService.getPrices(this.index);
        this.incidents = await this.dataService.getIncidents(this.index);
        for (const i of this.incidents) {
            Object.assign(i, this.getPriceAtMoment(i.date) || {});
        }
        const lastIndex = this.incidents.length - 1;
        this.selectByIndex(lastIndex);
    }

    getPriceAtMoment(date: string | Date) {
        const t = moment(date);
        let last: any;
        for (const p of this.prices) {
            if (!last) {
                last = p;
                continue;
            }
            const current = moment(p.date);
            if (current.isAfter(last.date) && current.isSameOrBefore(t)) {
                last = p;
            }
        }
        return {
            lastDate: last.date,
            lastPrice: last.price,
        };
    }

    select(item) {
        this.selected = item;
    }

    selectByIndex(index: number) {
        const item = this.incidents[index];
        this.selected = item || null;
    }

    get selectedIndex() {
        if (!Array.isArray(this.incidents) || !this.incidents.length) {
            return null;
        }
        return this.incidents.indexOf(this.selected);
    }

    get finalScore() {
        const score = Array.isArray(this.incidents) && this.incidents.length &&
            this.incidents[this.incidents.length - 1].score || '';

        return score.split(':').join('-');
    }

}
