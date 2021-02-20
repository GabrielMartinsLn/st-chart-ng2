import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Graph01Component } from './graph-01.component';

const routes: Routes = [{
    path: '',
    component: Graph01Component
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [Graph01Component]
})
export class Graph01Module { }
