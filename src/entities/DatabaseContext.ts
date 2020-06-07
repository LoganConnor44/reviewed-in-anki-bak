import Dexie from 'dexie';
import { IReview } from './IReview';
import { IPreference } from './IPreference';

export class ReviewedDb extends Dexie {
    reviews: Dexie.Table<IReview, number>;
    preferences: Dexie.Table<IPreference, number>;

    constructor() {
        super('ReviewedDb');
        this.version(1).stores({
            reviews: `++id`,
            preferences: `++id`
        });
        this.reviews = this.table("reviews");
        this.preferences = this.table("preferences");
    }
}