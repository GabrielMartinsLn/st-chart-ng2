import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { Graph01Component } from './graph-01.component';
import { SelectedItemComponent } from './selected-item/selected-item.component';

const routes: Routes = [{
    path: '',
    component: Graph01Component
}];

@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [Graph01Component, SelectedItemComponent]
})
export class Graph01Module { }
