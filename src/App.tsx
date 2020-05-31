import React, { useState } from 'react';
import Panel from './Panel';
import axios from 'axios';
import { ReviewedDb } from './entities/DatabaseContext';
import { IReview } from './entities/IReview';

const App = () => {
	const indexedDb = new ReviewedDb();
	let initialReview: IReview = {
		createdTimestamp: Date.now(),
		displayContent: 'Loading...'
	};
	const [reviewed, setReviewed] = useState<IReview[]>([initialReview]);

	const retrieveDataFromAnkiApi = async (): Promise<string[]> => {
		let trends: string[] = [];
		const cardsReviewedQuery = {
			"action": "findNotes",
			"version": 6,
			"params": {
				"query": "rated:2"
			}
		};
	
		const cardsReviewed = await axios.post('api', cardsReviewedQuery);
		if (typeof cardsReviewed.data.result === 'undefined' || cardsReviewed.data.result.length === 0) {
			return trends;
		}
		const detailOfCardsReviewed = {
			"action": "notesInfo",
			"version": 6,
			"params": {
				"notes": cardsReviewed.data.result
			}
		};
		const detailsOfCardsReviewed = await axios.post('/api', detailOfCardsReviewed);
		
		if (typeof detailsOfCardsReviewed.data.result !== 'undefined') {
			detailsOfCardsReviewed.data.result.forEach( (z: any) => {
				if (typeof z.fields.Hanzi !== 'undefined') {
					trends.push(z.fields.Hanzi.value);
				}
				if (typeof z.fields['Simplified Hanzi'] !== 'undefined') {
					trends.push(z.fields['Simplified Hanzi'].value);
				}
			});
		}
		if (trends.length === 0) {
			console.log('No data returned.');
			trends.push('No cards studied today.');
			trends.push('Nothing found.');
			trends.push('Perform a sync if you are expecting results.');
			trends.push('Looks like you\'ve been lazy.');
		}
		return trends;
	};
	
	const getAnkiData = async (db: ReviewedDb): Promise<void> => {
		console.log('calling get anki data');
		let ankiData: string[] = [];
		let results = await db.reviews.toArray();
		if (results.length > 0 && Date.now() - results[0].createdTimestamp > 300000) {
			db.reviews.clear();
			ankiData = await retrieveDataFromAnkiApi();
			const reviews: IReview[] = ankiData.map(x => {
				let review: IReview = {
					createdTimestamp: Date.now(),
					displayContent: x
				};
				return review;
			});
			db.reviews.bulkAdd(reviews);
		}
	};

	getAnkiData(indexedDb).then( () => {
		//indexedDb.reviews.toArray().then(x => setReviewed(x));
		const panels = reviewed.map((value, index) => {
			const delayCount = (5 * index);
			return <Panel purpose='content' delay={delayCount} />
		});
		console.log(panels);
	});

	return (
		<Panel purpose='loading' delay={1} />
	);
};

export default App;