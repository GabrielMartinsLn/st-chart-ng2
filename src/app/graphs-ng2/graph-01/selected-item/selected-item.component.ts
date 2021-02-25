import { Component, Input, OnInit } from '@angular/core';
import { IncidentItem } from '../graph-01.service';

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
    return this.item.$$moment.format('L');
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
