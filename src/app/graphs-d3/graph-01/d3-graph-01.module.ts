import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { D3Graph01Component } from './graph-01/d3-graph-01.component';
import { D3Graph01ChartComponent } from './graph-01/d3-graph-01-chart.component';

const routes: Routes = [{
    path: '',
    component: D3Graph01Component
}];

@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        D3Graph01Component,
        D3Graph01ChartComponent
    ],
    providers: [CurrencyPipe]
})
export class D3Graph01Module { }
