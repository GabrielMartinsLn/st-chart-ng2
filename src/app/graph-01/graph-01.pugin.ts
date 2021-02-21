import { Chart } from 'chart.js';
import * as d3 from 'd3';

export const graph01Plugin = {
    id: 'graph-01-plugin',
    afterDatasetDraw: (chart) => {
        const ctx = chart.ctx;
        let x = 80;
        let y = 90;
        const w = 72;
        const h = 24;
        const marginX = 16;

        const xAxis = chart.scales.x;
        const yAxis = chart.scales.y;
        const ticks = yAxis.ticksAsNumbers;

        const graph01 = chart.options.graph01;
        const data = chart.config.data.datasets[0].data;

        const text1 = typeof graph01?.text1 === 'function' ? graph01?.text1() : '';
        const text2 = typeof graph01?.text2 === 'function' ? graph01?.text2() : '';

        if (!text1) {
            return;
        }

        const max = d3.max(data);
        const scale = d3.scaleLinear()
            .domain([d3.min(ticks), d3.max(ticks)])
            .range([yAxis.bottom, yAxis.top]);

        x = xAxis.right + marginX;
        y = scale(max) - h / 2;

        ctx.save();

        ctx.fillStyle = '#0ea1e8';

        const tX = x + .5;
        ctx.beginPath();
        ctx.moveTo(tX, y);
        ctx.lineTo(tX, y + h);
        ctx.lineTo(tX - h * .35, y + h / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillRect(x, y, w, h);
        if (text2) {
            ctx.fillStyle = '#5ed56d';
            ctx.fillRect(x, y + h, w, h);
        }

        ctx.font = 'bold 16px Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif';
        ctx.fillStyle = '#fff';

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        // Text
        const textX = x + w / 2;
        const textY = y + h / 2;
        ctx.fillText(text1, textX, textY);
        if (text2) {
            ctx.fillText(text2, textX, textY + h);
        }

        ctx.restore();
    }
};

Chart.plugins.register(graph01Plugin);
