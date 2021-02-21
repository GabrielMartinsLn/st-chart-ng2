import { Injectable } from '@angular/core';

import { INCIDENTS, PRICES } from './data';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    async getIncidents() {
        return INCIDENTS.slice(0);
    }

    async getPrices() {
        return PRICES.slice(0);
    }

    async getPricesRandom() {
        return PRICES.map(i => {
            return {
                ...i,
                price: Math.round(Math.random() * 200) + 50
            };
        });
    }

}
