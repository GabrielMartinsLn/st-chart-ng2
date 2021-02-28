import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { Graph01Component } from './graph-01.component';
import { GraphCommonModule } from '../../common/graph-common.module';

const routes: Routes = [{
    path: '',
    component: Graph01Component
}];

@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        GraphCommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [Graph01Component],
    providers: [CurrencyPipe]
})
export class Ng2Graph01Module { }
