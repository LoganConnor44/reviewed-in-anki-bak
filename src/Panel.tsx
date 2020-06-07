import React, { FunctionComponent } from 'react';
import './index.css';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';

const randomizer = (things: any): any => things[Math.floor(things.length * Math.random())];
const setDelayMilliSeconds = (delay: number): number =>  delay * 5000;

const getAnimationStyles = (isALoadingPanel: boolean, delay: number): React.CSSProperties => {
	let animationStyles: React.CSSProperties = {};
	const positions: string[] = [
		'horizontal',
		'vertical'
	];
	const panelType: string = randomizer(positions);
	let animationDirections: object[] = [];
	const animationDelayMilliseconds: number = setDelayMilliSeconds(delay);
	const animationSeconds: number = 500;
	
	if (panelType === 'horizontal') {
		const leftToRight: object = {
			name: 'slide-left-to-center',
			css: {
				left: '-100%'
			}
		};
		const rightToLeft: object = {
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
		const topToBottom: object = {
			name: 'slide-top-to-center',
			css: {
				top: '-100%'
			}
		};
		const bottomToTop: object = {
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
		const firstAnimeName: any = randomizer(animationDirections);
		const animationDuration: string = animationSeconds + 'ms';
		const animationTimingFunction: string = 'ease-out';
		const animationDelay: string = animationDelayMilliseconds + 'ms';
		const animationIterationCount: number = 1;
		const animationDirection: string = 'normal';
		const animationFillMode: string = 'forwards';

		animationStyles = {
			...firstAnimeName.css,
			...{
				position: 'absolute',
				WebkitAnimationName: firstAnimeName.name,
				WebkitAnimationDuration: animationDuration,
				WebkitAnimationTimingFunction: animationTimingFunction,
				WebkitAnimationDelay: animationDelay,
				WebkitAnimationIterationCount: animationIterationCount,
				WebkitAnimationDirection: animationDirection + ', ' + animationDirection,
				WebkitAnimationFillMode: animationFillMode + ', ' + animationFillMode,
				animationName: firstAnimeName.name,
				animationDuration: animationDuration,
				animationTimingFunction: animationTimingFunction,
				animationDelay: animationDelay,
				animationIterationCount: animationIterationCount,
				animationDirection: animationDirection,
				animationFillMode: animationFillMode,
			}
		};
	}
	return animationStyles;
};

type PanelProps = {
	purpose: string,
	delay: number,
	cardText: string
};
const Panel: FunctionComponent<PanelProps> = ({purpose, delay, cardText}) => {
	const panelId: string = purpose + '-cell';
	const colours: string[] = [
		'#ff3031',
		'#68ac0d',
		'#00a8da',
		'#fbc500'
	];
	const isLoading: boolean = purpose === 'loading' ? true : false;
	const sharedStyles: object = {
		backgroundColor: randomizer(colours),
		
	};
	const animationStyles: React.CSSProperties = getAnimationStyles(isLoading, delay);
	const cellStyles: React.CSSProperties = {
		...sharedStyles,
		...animationStyles,
		...{
			width: '100%',
			height: '100%'
		}
	};
	const trendStyles: React.CSSProperties = {
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
    const capitalizeFirstCharacter = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);
    
	const content: string = !isLoading ? cardText : capitalizeFirstCharacter(purpose) + '...';
	const hideCursor: boolean = !isLoading;
	const typingDelayMilliseconds: number = setDelayMilliSeconds(delay) + 500;
	
	return (
		<div id={panelId} style={cellStyles} >
			<div style={trendStyles}>
				<Typist startDelay={typingDelayMilliseconds}
					cursor={{
						blink: true,
						hideWhenDone: hideCursor,
						hideWhenDoneDelay: 0
					}} >
					{content}
				</Typist>
			</div>
		</div>
	);
}

export default Panel;