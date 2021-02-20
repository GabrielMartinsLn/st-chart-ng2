import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';

@Component({
    templateUrl: './graph-01.component.html',
    styleUrls: ['./graph-01.component.scss']
})
export class Graph01Component implements OnInit {
    data: any[];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.getData();
    }

    async getData() {
        this.data = await this.dataService.getIncidents();
    }

}
