import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'ng2',
    loadChildren: () => import('./graphs-ng2/graph-01/ng2-graph-01.module').then(m => m.Ng2Graph01Module)
  },
  {
    path: 'd3',
    loadChildren: () => import('./graphs-d3/graph-01/d3-graph-01.module').then(m => m.D3Graph01Module)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/d3'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
