import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
    selector: 'app-d3-chart',
    template: ''
})
export class D3Graph01ChartComponent implements OnInit, OnChanges {
    @Input() incidents: any[];
    @Input() prices: any[];

    private built: boolean;
    private hasData: boolean;
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;


    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        this.build();
    }

    ngOnChanges() {
        this.build();
    }

    build() {
        this.processData();
        if (this.prices && this.prices.length) {
            if (!this.built) {
                this.buildGraph();
            } else {
                this.updateGraph();
            }
        }
    }

    processData() {
        this.hasData = Array.isArray(this.prices) && !!this.prices.length;
        if (this.hasData) {
            for (const i of this.prices) {
                i.dateMs = moment(i.date).valueOf();
            }
        } else {
            this.prices = [];
        }
    }

    buildGraph() {
        const width = 900;
        const height = 500;

        const prices = this.prices;
        const pricesTimes = prices.map(i => i.dateMs);
        const pricesValue = prices.map(i => i.price);

        this.svg = d3.select(this.elRef.nativeElement as any)
            .append('svg')
            .style('border', 'solid thin #ccc')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMin meet');

        const xScale = d3.scaleLinear()
            .domain([d3.min(pricesTimes), d3.max(pricesTimes)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(pricesValue), d3.max(pricesValue)])
            .range([height - 16, 0]);

        const line = d3.line()
            .x((d: any) => xScale(d.dateMs))
            .y((d: any) => yScale(d.price) + 8);

        this.svg.append('g')
            .classed('prices-line', true)
            .append('path')
            .datum(prices)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('d', line as any)
            .attr('stroke', 'black');

        this.built = true;
    }

    updateGraph() {
        const width = 900;
        const height = 500;

        const prices = this.prices;
        const pricesTimes = prices.map(i => i.dateMs);
        const pricesValue = prices.map(i => i.price);

        const xScale = d3.scaleLinear()
            .domain([d3.min(pricesTimes), d3.max(pricesTimes)])
            .range([0, width]);


        const yScale = d3.scaleLinear()
            .domain([d3.min(pricesValue), d3.max(pricesValue)])
            .range([height - 16, 0]);

        const line = d3.line()
            .x((d: any) => xScale(d.dateMs))
            .y((d: any) => yScale(d.price) + 8);

        const lineGroup = this.svg.select('.prices-line');

        lineGroup.select('path').remove();

        lineGroup
            .append('path')
            .datum(prices)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('d', line as any)
            .attr('stroke', 'black');
    }

}
