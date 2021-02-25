import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data/data.service';

@Component({
    selector: 'app-d3-graph-01',
    templateUrl: './d3-graph-01.component.html',
    styleUrls: ['./d3-graph-01.component.scss']
})
export class D3Graph01Component implements OnInit {
    prices: any;
    private index: number;

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
        const nIndex = (this.index - 1) || 0;
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
    }

}
