import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { D3Graph01Component } from './graph-01/d3-graph-01.component';

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
    declarations: [D3Graph01Component],
    providers: [CurrencyPipe]
})
export class D3Graph01Module { }
