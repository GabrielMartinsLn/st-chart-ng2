import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectedItemComponent } from './selected-item/selected-item.component';

@NgModule({
    declarations: [SelectedItemComponent],
    imports: [CommonModule],
    exports: [SelectedItemComponent],
    providers: [],
})
export class GraphCommonModule { }
