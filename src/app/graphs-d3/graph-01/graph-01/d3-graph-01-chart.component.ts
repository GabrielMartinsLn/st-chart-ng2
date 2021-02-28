import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import * as d3 from 'd3';
import * as moment from 'moment';

const marginLeft = 10;
const marginTop = 10;
const contentWidth = 700;
const contentHeight = 450;

const yAxisWidth = 99;
const xAxisHeight = 50;

const width = marginLeft + contentWidth + yAxisWidth;
const height = contentHeight + xAxisHeight;

@Component({
    selector: 'app-d3-chart',
    template: '',
    styleUrls: ['d3-graph-01-chart.component.scss'],
    providers: [CurrencyPipe],
    encapsulation: ViewEncapsulation.None
})
export class D3Graph01ChartComponent implements OnInit, OnChanges {
    @Input() incidents: any[];
    @Input() prices: any[];
    @Input() selected: any[];
    @Input() selectedIndex: number;
    @Output() selectedIndexChange = new EventEmitter();

    private built: boolean;
    private hasData: boolean;
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

    private animDuration = .6e3;

    private xAxisDates: Date[];

    private lastPrice: number;
    private priceIncrease: number;

    private xScale: d3.ScaleTime<number, number, never>;
    private yScale: d3.ScaleLinear<number, number, never>;

    constructor(
        private elRef: ElementRef,
        private currency: CurrencyPipe
    ) { }

    ngOnInit() {
        this.build();
    }

    ngOnChanges(changes: SimpleChanges) {
        const shouldRebuild = (changes.incidents && changes.incidents.previousValue !== changes.incidents.currentValue) ||
            (changes.prices && changes.prices.previousValue !== changes.prices.currentValue);
        if (shouldRebuild) {
            this.build();
        } else if (this.built) {
            this.updateSelectedIncident();
        }
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
            const begin = moment(this.prices[0].date);
            const end = moment(this.prices[this.prices.length - 1].date);
            const d = end.diff(begin, 'minutes');
            this.xAxisDates = [
                begin.toDate(),
                begin.clone().add(d / 2, 'minutes').toDate(),
                end.toDate(),
            ];
            const firstPrice = this.prices[0].price;
            const lastIndex = Math.max(0, this.prices.length - 1);
            this.lastPrice = this.prices[lastIndex].price;
            this.priceIncrease = (100 * this.lastPrice) / firstPrice - 100;
        } else {
            this.prices = [];
        }
    }

    buildGraph() {
        const prices = this.prices;
        const pricesTimes = prices.map(i => (i.date));
        const pricesValue = prices.map(i => i.price);

        this.svg = d3.select(this.elRef.nativeElement as any)
            .append('svg')
            .classed('d3-graph-01', true)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMin meet');

        this.svg.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(${marginLeft}, ${marginTop + contentHeight})`);

        this.svg.append('g')
            .classed('y-axis', true)
            .attr('transform', `translate(${marginLeft + contentWidth}, ${marginTop})`);

        this.svg.append('g').classed('graph-content', true)
            .attr('transform', `translate(${marginLeft}, ${marginTop})`);

        this.svg.append('g').classed('price-annotation', true);

        this.xScale = d3.scaleTime().range([0, contentWidth]);
        this.yScale = d3.scaleLinear().range([contentHeight, 0]);

        this.xScale.domain([d3.min(pricesTimes), d3.max(pricesTimes)]);
        this.yScale.domain([d3.min(pricesValue), d3.max(pricesValue)]).nice(5);

        // Background
        this.svg.select('g.graph-content')
            .append('rect')
            .classed('graph-background', true)
            .attr('width', contentWidth)
            .attr('height', contentHeight)
            .attr('rx', 9)
            .attr('fill', '#fff');

        // Grid
        const gridData = this.yScale.ticks(5);
        this.svg.select('g.graph-content')
            .append('g')
            .classed('graph-grid', true)
            .selectAll('.y-grid-item')
            .data(gridData.slice(0, gridData.length - 1))
            .enter()
            .append('line')
            .classed('y-grid-item', true)
            .attr('stroke-width', 1)
            .attr('stroke', '#3f3f3f15')
            .attr('x1', 0)
            .attr('x2', contentWidth)
            .attr('y1', d => this.yScale(d))
            .attr('y2', d => this.yScale(d));

        // Prices Line
        const line = d3.line()
            .x((d: any) => this.xScale(d.dateMs))
            .y((d: any) => this.yScale(d.price))
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
            .x((d: any) => this.xScale(d.dateMs))
            .y0(contentHeight)
            .y1((d: any) => this.yScale(d.price))
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
        const incidentsItems = this.svg.select('g.graph-content')
            .append('g')
            .classed('incidents', true)
            .selectAll('g.incident-item')
            .data(this.incidents)
            .enter()
            .append('g')
            .classed('incident-item', true);
        incidentsItems.append('circle')
            .attr('r', 7)
            .attr('cx', (d: any) => this.xScale(d.lastDate) - 1)
            .attr('cy', (d: any) => this.yScale(d.lastPrice))
            .attr('fill', 'none')
            .transition()
            .delay(this.animDuration + 1.2e3)
            .attr('fill', '#0ea1e8')
            .attr('stroke-width', 3)
            .attr('stroke', '#fff');
        incidentsItems.on('click', (e, d) => this.onIncidentClick(d));

        // X Axis
        this.svg.select('.x-axis')
            .selectAll('.x-axis-item')
            .data(this.xAxisDates)
            .enter()
            .append('text')
            .classed('x-axis-item', true)
            .text((d: any) => moment(d).format('HH:mm'))
            .attr('x', d => this.xScale(d))
            .attr('y', 20)
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', (d, i) => i === 0 ? 'start' : (i === 2 ? 'end' : 'middle'));

        // Y Axis
        this.svg.select('.y-axis')
            .selectAll('.y-axis-item')
            .data(this.yScale.ticks(5))
            .enter()
            .append('text')
            .classed('y-axis-item', true)
            .text(v => this.parseYAxisText(v))
            .attr('x', 10)
            .attr('y', d => this.yScale(d))
            .attr('dominant-baseline', 'middle');

        this.buildPriceAnnotation();
        this.updateSelectedIncident();

        this.built = true;
    }

    buildPriceAnnotation() {
        const w = 80;
        const h = 24;
        const w2 = h / 3;
        const x = contentWidth + marginLeft + 9;
        const y = this.yScale(this.lastPrice) + marginTop - h / 2;
        const poly = [
            { x: 0, y: h / 2 },
            { x: w2, y: 0 },
            { x: w, y: 0 },
            { x: w, y: h },
            { x: w2, y: h },
            { x: 0, y: h / 2 },
        ];
        // Annotation
        this.svg.select('g.price-annotation')
            .attr('transform', `translate(${x}, ${y})`);
        // Box 1
        this.svg.select('g.price-annotation')
            .selectAll('polygon')
            .data([poly])
            .enter()
            .append('polygon')
            .attr('fill', '#0ea1e8')
            .attr('points', d => d.map(i => [i.x, i.y]).join(','));
        // Box 1 Text
        this.svg.select('g.price-annotation')
            .append('text')
            .classed('price-text1', true)
            .text(() => this.parseYAxisText(this.lastPrice))
            .attr('x', (w + w2) * .5)
            .attr('y', h * .5)
            .attr('fill', '#fff')
            .attr('font-size', 16)
            .attr('font-weight', 900)
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', 'middle');
        // Box 2
        this.svg.select('g.price-annotation')
            .append('rect')
            .attr('x', w2)
            .attr('y', h - .5)
            .attr('width', w - w2)
            .attr('height', h)
            .attr('fill', '#5ed56d');
        // Box 2 Text
        this.svg.select('g.price-annotation')
            .append('text')
            .classed('price-text2', true)
            .text(this.priceIncreaseText)
            .attr('x', (w + w2) * .5)
            .attr('y', h * 1.5)
            .attr('fill', '#fff')
            .attr('font-size', 16)
            .attr('font-weight', 900)
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', 'middle');
    }

    updateGraph() {
        const prices = this.prices;
        const pricesTimes = prices.map(i => (i.date));
        const pricesValue = prices.map(i => i.price);

        this.xScale.domain([d3.min(pricesTimes), d3.max(pricesTimes)]);
        this.yScale.domain([d3.min(pricesValue), d3.max(pricesValue)]).nice(5);

        this.svg.append('g')
            .classed('x-axis', true)
            .attr('transform', `translate(0, ${marginTop + contentHeight})`);

        this.svg.append('g')
            .classed('y-axis', true)
            .attr('transform', `translate(${contentWidth}, ${marginTop})`);

        this.svg.append('g').classed('graph-content', true)
            .attr('transform', `translate(0, ${marginTop})`);

        // Grid
        const gridData = this.yScale.ticks(5);
        const gridGroup = this.svg.select('g.graph-grid');
        gridGroup.selectAll('.y-grid-item').remove();
        gridGroup.selectAll('.y-grid-item')
            .data(gridData.slice(0, gridData.length - 1))
            .enter()
            .append('line')
            .classed('y-grid-item', true)
            .attr('stroke-width', 1)
            .attr('stroke', '#3f3f3f15')
            .attr('x1', 0)
            .attr('x2', contentWidth)
            .attr('y1', d => this.yScale(d))
            .attr('y2', d => this.yScale(d));

        // Line
        const line = d3.line()
            .x((d: any) => this.xScale(d.date))
            .y((d: any) => this.yScale(d.price))
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
            .x((d: any) => this.xScale(d.dateMs))
            .y0(contentHeight)
            .y1((d: any) => this.yScale(d.price))
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
            .duration(.5e3)
            .attr('fill', '#0ea1e80f');

        // Incidents
        const circlesGroup = this.svg.select('g.incidents');
        circlesGroup.selectAll('g.incident-item').remove();
        const incidentsItems = circlesGroup
            .selectAll('g.incident-item')
            .data(this.incidents)
            .enter()
            .append('g')
            .classed('incident-item', true);
        incidentsItems
            .append('circle')
            .attr('r', 8)
            .attr('cx', (d: any) => this.xScale(d.lastDate) - 1)
            .attr('cy', (d: any) => this.yScale(d.lastPrice))
            .attr('fill', 'none')
            .transition()
            .delay(this.animDuration + .6e3)
            .attr('fill', '#0ea1e8')
            .attr('stroke-width', 3)
            .attr('stroke', '#fff');
        incidentsItems.on('click', (e, d) => this.onIncidentClick(d));

        // X Axis
        const xAxisGroup = this.svg.select('.x-axis');
        xAxisGroup.selectAll('.x-axis-item').remove();
        xAxisGroup.selectAll('.x-axis-item')
            .data(this.xAxisDates)
            .enter()
            .append('text')
            .classed('x-axis-item', true)
            .text((d: any) => moment(d).format('HH:mm'))
            .attr('x', d => this.xScale(d))
            .attr('y', 20)
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', (d, i) => i === 0 ? 'start' : (i === 2 ? 'end' : 'middle'));

        // Y Axis
        const yAxisGroup = this.svg.select('.y-axis');
        yAxisGroup.selectAll('.y-axis-item').remove();
        yAxisGroup
            .selectAll('.y-axis-item')
            .data(this.yScale.ticks(5))
            .enter()
            .append('text')
            .classed('y-axis-item', true)
            .text(v => this.parseYAxisText(v))
            .attr('x', 10)
            .attr('y', d => this.yScale(d))
            .attr('dominant-baseline', 'middle');

        this.updatePriceAnnotation();
        this.updateSelectedIncident();

    }

    updatePriceAnnotation() {
        const h = 24;
        const x = contentWidth + marginLeft + 9;
        const y = this.yScale(this.lastPrice) + marginTop - h / 2;
        // Annotation
        this.svg.select('g.price-annotation')
            .attr('transform', `translate(${x}, ${y})`);
        this.svg.select('g.price-annotation')
            .select('.price-text1')
            .text(this.parseYAxisText(this.lastPrice));
        this.svg.select('g.price-annotation')
            .select('.price-text2')
            .text(this.priceIncreaseText);

    }

    updateSelectedIncident() {
        this.svg.select('g.incidents').selectAll('circle')
            .classed('active', (d, i) => {
                // console.log({ d, i });
                return this.selectedIndex === i;
            });
    }

    onIncidentClick(item) {
        const index = this.incidents.indexOf(item);
        this.selectedIndexChange.emit(index);
    }

    private parseYAxisText(v: any) {
        v = (+v / 1e2);
        return this.currency.transform(v, 'EUR');
    }

    private get priceIncreaseText() {
        return this.priceIncrease > 0 ? `+${this.priceIncrease.toFixed(1)}%` : `${this.priceIncrease.toFixed(1)}%`;
    }

}
