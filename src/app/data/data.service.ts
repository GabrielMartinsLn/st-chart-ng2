import { Injectable } from '@angular/core';

import { INCIDENTS_01, PRICES_01 } from './data-01';
import { INCIDENTS_02, PRICES_02 } from './data-02';
import { INCIDENTS_03, PRICES_03 } from './data-03';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    async getIncidents(index?: number) {
        switch (index) {
            case 1: return INCIDENTS_02.slice(0);
            case 2: return INCIDENTS_03.slice(0);
            default: return INCIDENTS_01.slice(0);
        }
    }

    async getPrices(index?: number) {
        switch (index) {
            case 1: return PRICES_02.slice(0);
            case 2: return PRICES_03.slice(0);
            default: return PRICES_01.slice(0);
        }
    }

}
