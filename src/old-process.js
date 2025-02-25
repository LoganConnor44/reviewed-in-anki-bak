
let trends = ['Loading...'];
var previousFiveTrends = [];
let cardsReviewedQuery = {
    "action": "findNotes",
    "version": 6,
    "params": {
        "query": "rated:2"
    }
};
axios.post('api', cardsReviewedQuery)
	.then(x => {
		console.log('Request successful. Iterating through returned data for details.');
		let detailOfCardsReviewed = {
			"action": "notesInfo",
			"version": 6,
			"params": {
				"notes": x.data.result
			}
		};
		axios.post('/api', detailOfCardsReviewed)
			.then(y => {
				console.log('Request successful. Determining which fields to retrieve data from.');
				if (trends.includes('Loading...')) {
					trends = [];
				}
				if (typeof y.data.result !== 'undefined') {
					y.data.result.forEach(z => {
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
			});
	});

var colors = [
	'#ff3031',
	'#68ac0d',
	'#00a8da',
	'#fbc500'
];

const randomizer = things => things[Math.floor(things.length * Math.random())];
let container = document.getElementById('asdf');

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

		var randomTrend = randomizer(trends);
		
		if (trends.length > 1) {
			do {
				randomTrend = randomizer(trends);			
			} while (previousFiveTrends.includes(randomTrend))
			previousFiveTrends.unshift(randomTrend);
			if (previousFiveTrends.length > 5) {
				previousFiveTrends.pop();
			}
			console.log('Previous Five Trends');
			console.log(previousFiveTrends);
		}

		trend.title = randomTrend;
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