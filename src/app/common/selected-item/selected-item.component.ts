import { Component, Input, OnInit } from '@angular/core';
import { IncidentItem } from '../../graphs-ng2/graph-01/graph-01.service';

import * as moment from 'moment';

@Component({
  selector: 'app-selected-item',
  templateUrl: './selected-item.component.html',
  styleUrls: ['./selected-item.component.scss']
})
export class SelectedItemComponent implements OnInit {
  @Input() item: IncidentItem;
  @Input() finalScore: number;

  constructor() { }

  ngOnInit(): void {
  }

  get date() {
    return moment(this.item.date).format('L');
  }

  get clockTime() {
    return `${this.item.clockTime.split(':')[0]}’`;
  }

  get score() {
    return this.item?.score?.split(':').join('-');
  }

  get cardColor() {
    switch (this.item.type) {
      case 'Red card': return 'red-card';
      case 'Yellow card': return 'yellow-card';
      default: return null;
    }
  }

  get isBeginOrEnd() {
    return this.item?.type && ['begin', 'end'].indexOf(this.item.type) > -1;
  }

}
