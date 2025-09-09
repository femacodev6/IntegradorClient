import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface InventoryStatus {
    label: string;
    value: string;
}

export interface Tardanza {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
    
      identificacion?: string,
      nombre?: string,
      apellidos?: string,
      dia?: string,
      turno?: string,
      atraso?: number,
      entrada_real?: string,
      entrada?: string,
      momento_revision?: boolean | null,
      aprobador?: string | null,
      observaciones?: string | null,
      tolerancia?: number
}

@Injectable()
export class TardanzaService {

    getTardanzasData(fechaInicio?: string, fechaFin?: string): Promise<Tardanza[]> {
        const fi = fechaInicio;
        const ff = fechaFin;
        if (!fi || !ff) {
            return Promise.reject('Selecciona fecha inicio y fecha fin');
        }
        const url = `/api/Tardanzas/ObtenerTardanzas?fechaInicio=${fi}&fechaFin=${ff}`;
        return firstValueFrom(this.http.get<Tardanza[]>(url));
    }

    status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    tardanzaNames: string[] = [
        'Bamboo Watch',
        'Black Watch',
        'Blue Band',
        'Blue T-Shirt',
        'Bracelet',
        'Brown Purse',
        'Chakra Bracelet',
        'Galaxy Earrings',
        'Game Controller',
        'Gaming Set',
        'Gold Phone Case',
        'Green Earbuds',
        'Green T-Shirt',
        'Grey T-Shirt',
        'Headphones',
        'Light Green T-Shirt',
        'Lime Band',
        'Mini Speakers',
        'Painted Phone Case',
        'Pink Band',
        'Pink Purse',
        'Purple Band',
        'Purple Gemstone Necklace',
        'Purple T-Shirt',
        'Shoes',
        'Sneakers',
        'Teal T-Shirt',
        'Yellow Earbuds',
        'Yoga Mat',
        'Yoga Set'
    ];

    constructor(private http: HttpClient) { }

    getTardanzas(fechaInicio :string,fechaFin: string): Promise<Tardanza[]> {
        return this.getTardanzasData(fechaInicio,fechaFin);
    }
    
    getTardanzasWithOrdersSmall() {
        // return Promise.resolve(this.getTardanzasWithOrdersData().slice(0, 10));
    }

    generatePrduct(): Tardanza {
        const tardanza: Tardanza = {
            id: this.generateId(),
            name: this.generateName(),
            description: 'Tardanza Description',
            price: this.generatePrice(),
            quantity: this.generateQuantity(),
            category: 'Tardanza Category',
            inventoryStatus: this.generateStatus(),
            rating: this.generateRating()
        };

        tardanza.image = tardanza.name?.toLocaleLowerCase().split(/[ ,]+/).join('-') + '.jpg';
        return tardanza;
    }

    generateId() {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    generateName() {
        return this.tardanzaNames[Math.floor(Math.random() * Math.floor(30))];
    }

    generatePrice() {
        return Math.floor(Math.random() * Math.floor(299) + 1);
    }

    generateQuantity() {
        return Math.floor(Math.random() * Math.floor(75) + 1);
    }

    generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    generateRating() {
        return Math.floor(Math.random() * Math.floor(5) + 1);
    }
}
