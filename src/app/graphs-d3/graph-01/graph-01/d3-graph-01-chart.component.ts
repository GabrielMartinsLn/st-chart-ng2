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

    private animDuration = 1.2e3;

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
                i.date = moment(i.date).toDate();
                i.dateMs = moment(i.date).valueOf();
            }
            for (const i of this.incidents) {
                i.date = moment(i.date).toDate();
                i.lastDate = moment(i.lastDate).toDate();
                i.dateMs = moment(i.date).valueOf();
            }
        } else {
            this.prices = [];
        }
    }

    buildGraph() {
        const contentWidth = 850;
        const contentHeight = 450;

        const yAxisWidth = 50;
        const xAxisHeight = 50;

        const width = contentWidth + yAxisWidth;
        const height = contentHeight + xAxisHeight;

        const prices = this.prices;
        const pricesTimes = prices.map(i => (i.date));
        const pricesValue = prices.map(i => i.price);

        this.svg = d3.select(this.elRef.nativeElement as any)
            .append('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMin meet');

        this.svg.append('g').classed('graph-content', true);

        const xScale = d3.scaleTime().range([0, contentWidth]);
        const yScale = d3.scaleLinear().range([contentHeight, 0]);

        xScale.domain([d3.min(pricesTimes), d3.max(pricesTimes)]);
        yScale.domain([d3.min(pricesValue), d3.max(pricesValue)]).nice();

        // return;

        // Prices Line

        const line = d3.line()
            .x((d: any) => xScale(d.dateMs))
            .y((d: any) => yScale(d.price))
            .curve(d3.curveStepBefore);

        const linePath = this.svg.select('g.graph-content')
            .append('g')
            .classed('prices-line', true)
            .append('path')
            .datum(prices)
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('stroke', '#0ea1e8')
            .attr('d', line);

        // Line animation
        const totalLength = linePath.node().getTotalLength();
        linePath
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(this.animDuration)
            .ease((d) => d)
            .attr('stroke-dashoffset', 0);

        // Prices Area
        const area = d3.area()
            .x((d: any) => xScale(d.dateMs))
            .y0(contentHeight)
            .y1((d: any) => yScale(d.price))
            .curve(d3.curveStepBefore);

        this.svg.select('g.graph-content')
            .append('g')
            .classed('prices-area', true)
            .append('path')
            .datum(prices)
            .transition()
            .delay(this.animDuration)
            .attr('d', area)
            .attr('fill', '#0ea1e800')
            .transition()
            .duration(.8e3)
            .attr('fill', '#0ea1e80f');


        // Incidents

        this.svg.select('g.graph-content')
            .append('g')
            .classed('incidents', true)
            .selectAll('circle')
            .data(this.incidents)
            .enter()
            .append('circle')
            .attr('r', 7)
            .attr('cx', (d: any) => xScale(d.lastDate) - 1)
            .attr('cy', (d: any) => yScale(d.lastPrice))
            .attr('fill', 'none')
            .transition()
            .delay(this.animDuration + 2e3)
            .attr('fill', '#0ea1e8')
            .attr('stroke-width', 3)
            .attr('stroke', '#fff')
            ;

        this.built = true;
    }

    updateGraph() {
        const width = 900;
        const height = 500;

        const prices = this.prices;
        const pricesTimes = prices.map(i => i.dateMs);
        const pricesValue = prices.map(i => i.price);

        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);

        xScale.domain([d3.min(pricesTimes), d3.max(pricesTimes)]);
        yScale.domain([d3.min(pricesValue), d3.max(pricesValue)]).nice();

        // Line

        const line = d3.line()
            .x((d: any) => xScale(d.date))
            .y((d: any) => yScale(d.price))
            .curve(d3.curveStepBefore);

        const lineGroup = this.svg.select('.prices-line');

        lineGroup.select('path').remove();

        const linePath = lineGroup
            .append('path')
            .datum(prices)
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('stroke', '#0ea1e8')
            .attr('d', line as any);

        // Line animation

        const totalLength = linePath.node().getTotalLength();
        linePath
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(this.animDuration)
            .ease((d) => d)
            .attr('stroke-dashoffset', 0);


        // Prices Area
        const area = d3.area()
            .x((d: any) => xScale(d.dateMs))
            .y0(height)
            .y1((d: any) => yScale(d.price))
            .curve(d3.curveStepBefore);

        const areaGroup = this.svg.select('.prices-area');
        areaGroup.select('path').remove();

        areaGroup
            .append('path')
            .datum(prices)
            .transition()
            .delay(this.animDuration)
            .attr('d', area)
            .attr('fill', '#0ea1e800')
            .transition()
            .duration(.8e3)
            .attr('fill', '#0ea1e80f');

        // Incidents

        const circlesGroup = this.svg.select('g.incidents');

        circlesGroup.selectAll('circle').remove();

        circlesGroup
            .selectAll('circle')
            .data(this.incidents)
            .enter()
            .append('circle')
            .attr('r', 8)
            .attr('cx', (d: any) => xScale(d.lastDate) - 1)
            .attr('cy', (d: any) => yScale(d.lastPrice))
            .attr('fill', 'none')
            .transition()
            .delay(this.animDuration + 1.2e3)
            .attr('fill', '#0ea1e8')
            .attr('stroke-width', 3)
            .attr('stroke', '#fff')
            ;


    }

}
