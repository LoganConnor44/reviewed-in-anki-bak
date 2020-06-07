import React, { useState, Fragment, useEffect } from 'react';
import Panel from './Panel';
import axios from 'axios';
import { ReviewedDb } from './entities/DatabaseContext';
import { IReview } from './entities/IReview';
import InstallPwa from './InstallPwa';

const shuffle = (mixMeUp: JSX.Element[]): JSX.Element[] => {
	let currentIndex: number = mixMeUp.length;
	let temporaryValue: JSX.Element;
	let randomIndex: number;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = mixMeUp[currentIndex];
		mixMeUp[currentIndex] = mixMeUp[randomIndex];
		mixMeUp[randomIndex] = temporaryValue;
	}

	return mixMeUp;
}

const App = () => {
	const indexedDb: ReviewedDb = new ReviewedDb();
	const [panels, setPanels] = useState<JSX.Element[]>([]);
	const ankiApiUrl = 'http://192.168.1.4:8765';

	useEffect(() => {
		const retrieveDataFromAnkiApi = async (numberOfItemsInIndexedDb: number): Promise<string[]> => {
			console.log(`retrieveDataFromAnkiApi :: Starting function`);
			let trends: string[] = [];
			const cardsReviewedQuery: object = {
				"action": "findNotes",
				"version": 6,
				"params": {
					"query": "rated:7"
				}
			};
			return await axios.post(ankiApiUrl, cardsReviewedQuery).then(x => {
				if (numberOfItemsInIndexedDb > 0 && numberOfItemsInIndexedDb === x.data.result.length) {
					console.log(`retrieveDataFromAnkiApi :: Exiting function :: Same records exist in IndexedDb`);
					return ['same-records'];
				}
				if (numberOfItemsInIndexedDb === 0) {
					return [
						'No cards studied today.',
						'Nothing found.',
						'Perform a sync if you are expecting results.',
						'Looks like you\'ve been lazy.'
					];
				}
				console.log(`retrieveDataFromAnkiApi :: Exiting function :: Proceed to processCardsReviewed`);
				return processCardsReviewed(x, trends);
			});
		};
	
		const processCardsReviewed = async (cardsReviewed: any, trends: string[]): Promise<string[]> => {
			console.log(`processCardsReviewed :: Starting function`);
			if (typeof cardsReviewed.data.result === 'undefined' || cardsReviewed.data.result.length === 0) {
				console.log(`processCardsReviewed :: Exiting function :: No cards returned`);
				return trends;
			}
			const detailOfCardsReviewed: object = {
				"action": "notesInfo",
				"version": 6,
				"params": {
					"notes": cardsReviewed.data.result
				}
			};
			return await axios.post(ankiApiUrl, detailOfCardsReviewed).then(y => {
				console.log(`processCardsReviewed :: Exiting function :: Proceed to processDetailedCardsReviewed`);
				return processDetailedCardsReviewed(y, trends);
			});
		}
	
		const processDetailedCardsReviewed = async (detailsOfCardsReviewed: any, trends: string[]): Promise<string[]> => {
			console.log(`processDetailedCardsReviewed :: Starting function`);
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
			console.log(`processDetailedCardsReviewed :: Exiting function`);
			return trends;
		};
		const getAnkiData = async (): Promise<void> => {
			console.log(`getAnkiData :: Starting function`);
			let tempPanels: JSX.Element[];
			let ankiData: string[] = [];
			let reviews: IReview[];
			let indexedDbResults: IReview[] = await indexedDb.reviews.toArray();
			ankiData = await retrieveDataFromAnkiApi(indexedDbResults.length);
			
			if (ankiData[0] !== 'same-records') {
				reviews = ankiData.map(x => {
					let review: IReview = {
						createdTimestamp: Date.now(),
						displayContent: x
					};
					return review;
				});
				indexedDb.reviews.clear();
				indexedDb.reviews.bulkAdd(reviews);
				tempPanels = reviews.map((value, index) => <Panel key={index} purpose='content' delay={index} cardText={value.displayContent}/>);
			} else {
				tempPanels = indexedDbResults.map((value, index) => <Panel key={value.id} purpose='content' delay={index} cardText={value.displayContent}/>);
			}
			
			setPanels(tempPanels);
			console.log(`getAnkiData :: Exiting function`);
		};
		getAnkiData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const loadingPanel: JSX.Element = <Panel key={99999} purpose='loading' delay={0} cardText={''}/>

	return (
		<Fragment>
			<InstallPwa database={indexedDb} />
			{loadingPanel}
			{ panels.length < 1 ? <div hidden></div> : panels.map(x => x) }
		</Fragment>
	);
};

export default App;