import React from 'react';
import './index.css';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';

const randomizer = things => things[Math.floor(things.length * Math.random())];

const getAnimationStyles = (isALoadingPanel, delay) => {
	const positions = [
		'horizontal',
		'vertical'
	];
	const panelType = randomizer(positions);
	let animationStyles = {};
	let animationDirections = [];
	const animationDelaySeconds = delay;
	const animationSeconds = 0.5;
	
	if (panelType === 'horizontal') {
		const leftToRight = {
			name: 'slide-left-to-center',
			css: {
				left: '-100%'
			}
		};
		const rightToLeft = {
			name: 'slide-right-to-center',
			css: {
				right: '-100%'
			}
		};
		animationDirections = [
			leftToRight,
			rightToLeft
		];
	}
	if (panelType === 'vertical') {
		const topToBottom = {
			name: 'slide-top-to-center',
			css: {
				top: '-100%'
			}
		};
		const bottomToTop = {
			name: 'slide-bottom-to-center',
			css: {
				bottom: '-100%'
			}
		};
		animationDirections = [
			topToBottom,
			bottomToTop
		];
	}
	
	if (!isALoadingPanel) {
		const randomDirection = randomizer(animationDirections);
		const animationDefinition = randomDirection.name + ' ' + animationSeconds + 's forwards';
		const animationDelayDefinition = animationDelaySeconds + 's';
		animationStyles = {
			...randomDirection.css,
			...{
				position: 'absolute',
				WebkitAnimation: animationDefinition,
				WebkitAnimationDelay: animationDelayDefinition,
				animation: animationDefinition,
				animationDelay: animationDelayDefinition
			}
		};
	}
	return animationStyles;
};

const Panel = ({purpose, delay}) => {
	const panelId = purpose + '-cell';
	const colours = [
		'#ff3031',
		'#68ac0d',
		'#00a8da',
		'#fbc500'
	];
	const isLoading = purpose === 'loading' ? true : false;
	const sharedStyles = {
		backgroundColor: randomizer(colours),
		
	};
	const animationStyles = getAnimationStyles(isLoading, purpose, delay);
	const cellStyles = {
		...sharedStyles,
		...animationStyles,
		...{
			width: '100%',
			height: '100%'
		}
	};
	const trendStyles = {
		...sharedStyles,
		...{
			top: '50%',
			height: '50%',
			position: 'absolute',
			font: "bold 1em/1 'Helvetica Neue', Helvetica, Arial, sans-serif",
			fontSize: '3em',
			letterSpacing: '-0.05em',
			color: '#fff',
			textShadow: '0 0.1em 0 rgba(0, 0, 0, 0.1)',
			textDecoration: 'none',
			left: '0.5em',
			right: '0.5em'
		}
	};
    const capitalizeFirstCharacter = word => word.charAt(0).toUpperCase() + word.slice(1);
    
	const content = !isLoading ? '我是软件工程师' : capitalizeFirstCharacter(purpose) + '...';
	const hideCursor = !isLoading;
	const setTypingDelay = () => delay > 1 ? ((delay * 1000) + 750) : 1500;
	const typingDelayMilliseconds = setTypingDelay();
	
	return (
		<div id={panelId} style={cellStyles} >
			<div id='anki-reviewed-content'>
				{/* <Typist startDelay={typingDelayMilliseconds}
					cursor={{
						blink: true,
						hideWhenDone: hideCursor,
						hideWhenDoneDelay: 0
					}} >
					{content}
				</Typist> */}
				<p>{content}</p>
			</div>
		</div>
	);
}

export default Panel;