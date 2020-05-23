import React from 'react';
import './App.css';
import axios from 'axios';

let trends = [];
let cardsReviewedQuery = {
    "action": "findNotes",
    "version": 6,
    "params": {
        "query": "rated:1"
    }
};
axios.post("http://localhost:8765/", cardsReviewedQuery)
	.then(x => {
		console.log(x);
		let detailOfCardsReviewed = {
			"action": "notesInfo",
			"version": 6,
			"params": {
				"notes": x.data.result
			}
		};
		axios.post("http://localhost:8765", detailOfCardsReviewed)
			.then(x => {
				console.log(x);
				x.data.result.forEach(x => trends.push(x.fields.Hanzi.value));
		});
});

var colors = [
	'#ff3031',
	'#68ac0d',
	'#00a8da',
	'#fbc500'
];

const randomizer = things => things[Math.floor(things.length * Math.random())];
let container = document.body;

// slide options
const slideEase = t => t * t * t;
const slideDuration = 1000;

// text options
const delay = {
	before: 300,
	between: 200,
	after: 2500
};

function Cell() {
	// create the node
	var node = document.createElement('div');
	node.className = 'cell';
	node.style.left = 0;
	node.style.top = 0;
	node.style.right = 0;
	node.style.bottom = 0;
	this.node = node;

	// create and add the panes
	var panes = [new Pane(this), new Pane(this)];
	node.appendChild(panes[0].node);
	node.appendChild(panes[1].node);
	panes[0].setNextNode(panes[1].node);
	panes[1].setNextNode(panes[0].node);

	// handles sliding in next pane
	var currentPane = 0;
	this.nextPane = function () {
		// swap z-indexes
		panes[currentPane].node.style.zIndex = '-1';
		currentPane = ++currentPane % 2;
		panes[currentPane].node.style.zIndex = '1';

		panes[currentPane].init();
	}

	// quickstart
	panes[0].quickStart();
	panes[0].node.style.zIndex = '1';
};




function Pane(cell) {
	var nextNode;
	this.setNextNode = next => nextNode = next;

	// create the node
	var node = document.createElement('div');
	node.className = 'pane';
	this.node = node;

	// a place to write the trends
	var trend = document.createElement('a');
	trend.className = 'trend';
	node.appendChild(trend);

	// (re-)initialize pane when sliding in
	this.init = function () {
		var dir = Math.floor(4 * Math.random());
		switch (dir) {
			case 0:
				slideStart = { left: 0, top: -100 };
				break;
			case 1:
				slideStart = { left: 100, top: 0 };
				break;
			case 2:
				slideStart = { left: 0, top: 100 };
				break;
			case 3:
				slideStart = { left: -100, top: 0 };
				break;
			default:
				break;
		}
		// make sure it's a different background color
		do
			node.style.backgroundColor = randomizer(colors);
		while (node.style.backgroundColor === nextNode.style.backgroundColor);

		trend.title = randomizer(trends);
		trend.href = 'https://www.google.com/search?q=' + trend.title;
		trend.innerHTML = '';

		// start sliding in
		slideValue = 0;
		slideIn();
	}

	// handles sliding in
	var slideStart,
		slideValue;
	var slideIn = function () {
		slideValue += 20 / slideDuration;
		if (slideValue >= 1) {
			// end of sliding in
			slideValue = 1;
			setTimeout(nextChar, delay.before);
		} else {
			setTimeout(slideIn, 20);
		}
		node.style.left = slideEase(1 - slideValue) * slideStart.left + '%';
		node.style.top = slideEase(1 - slideValue) * slideStart.top + '%';
		// push other node away
		nextNode.style.left =
			(slideEase(1 - slideValue) - 1) * slideStart.left + '%';
		nextNode.style.top =
			(slideEase(1 - slideValue) - 1) * slideStart.top + '%';
	}

	// handles text
	var nextChar = function () {
		if (trend.innerHTML.length < trend.title.length) {
			trend.innerHTML =
				trend.title.slice(0, trend.innerHTML.length + 1);
			setTimeout(nextChar, delay.between);
		} else {
			setTimeout(cell.nextPane, delay.after);
		}
	}

	// initial start
	this.quickStart = function () {
		node.style.backgroundColor = colors[3];
		trend.title = randomizer(trends);
		trend.href = 'https://www.google.com/search?q=' + trend.title;
		nextChar();
	}
};


// create the cells
let cells = [];
for (var i = 0; i < 1; i++) {
	cells[i] = new Cell();
	container.appendChild(cells[i].node);
}

// handles font size on resize
// quick and dirty, needs a fix
const calcFontsize = () => {
	let fontSize = Math.min(
		container.clientHeight / 2,
		container.clientWidth / 10
	);
	fontSize = Math.floor(fontSize);
	container.style.fontSize = fontSize + 'px';
}
calcFontsize();
window.onresize = calcFontsize;

const App = () => {
	return (<div />);
}

export default App;
