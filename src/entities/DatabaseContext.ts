import Dexie from 'dexie';
import { IReview } from './IReview';

export class ReviewedDb extends Dexie {
    reviews: Dexie.Table<IReview, number>;

    constructor() {
        super('ReviewedDb');
        this.version(1).stores({
            reviews: `++id`,
        });
        this.reviews = this.table("reviews");
    }
}