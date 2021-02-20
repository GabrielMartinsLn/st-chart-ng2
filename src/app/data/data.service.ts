import { Injectable } from '@angular/core';

import { INCIDENTS, PRICES } from './data';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    async getIncidents() {
        return INCIDENTS;
    }

    async getPrices() {
        return PRICES;
    }

}
