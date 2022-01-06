import { Box, Button, Container, TextField } from '@mui/material';
import RangeSlider from 'components/RangeSlider';
import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './App.css';
import { Context } from './context';

const choice = ['меньше', 'больше'];

function App() {
	const [state, setState] = useState({
		sliderValue: [1, 128],
		attemptNumber: 0,
		currChoice: null,
		countTry: null,
		possibleNumber: null,
		searchRange: null,
	});
	const [isPlay, setIsPlay] = useState('нет');

	function onPlay() {
		setIsPlay('да');
		guruNumber(state.sliderValue);
		setState((prev) => ({ ...prev, attemptNumber: 1 }));
	}
	function onEnd() {
		setIsPlay('нет');
		guruNumber(state.sliderValue);
	}
	function onFinish() {
		setIsPlay('финиш');
	}

	function preFinish(diff, currChoice) {
		if (diff[3] === 1) {
			console.log('типо срочный финиш', currChoice === choice[0] ? diff[1] : diff[2]);
			const possibleNum = currChoice === choice[0] ? diff[1] : diff[2];
			setState((prev) => ({
				...prev,
				possibleNumber: possibleNum,
			}));
			onFinish();
			return true;
		}
		return false;
	}

	function onCondition(currChoice) {
		guruNumber(state.searchRange, currChoice);
		setState((prev) => ({ ...prev, attemptNumber: prev.attemptNumber + 1 }));
	}

	function guruNumber(range, currChoice = null) {
		const [mid, min, max, diff] = getMidNum(range);

		if (currChoice) {
			console.log('выбор: ', currChoice);
			if (currChoice === choice[0]) {
				const newRange = [min, mid];
				console.log('search: ', newRange);
				const newMid = getMidNum(newRange);
				console.log('newRange: ', newMid);
				if (preFinish(newMid, currChoice)) return;
				setState((prev) => ({
					...prev,
					possibleNumber: newMid[0],
					searchRange: newRange,
					currChoice,
				}));
			}
			if (currChoice === choice[1]) {
				const newRange = [mid, max];
				console.log('search: ', newRange);
				const newMid = getMidNum(newRange);
				console.log('newRange: ', newMid);
				if (preFinish(newMid, currChoice)) return;
				setState((prev) => ({
					...prev,
					possibleNumber: newMid[0],
					searchRange: newRange,
					currChoice,
				}));
			}
		} else {
			setState((prev) => ({ ...prev, possibleNumber: mid, searchRange: range }));
		}
	}

	function getMidNum(range) {
		const diff = range[1] - range[0];
		const mid = Math.floor(diff / 2) + range[0];

		return [mid, range[0], range[1], diff];
	}

	return (
		<Context.Provider value={{ state, setState }}>
			<Container maxWidth='sm'>
				<div className='App'>
					{isPlay === 'нет' ? (
						<Box className='all-center'>
							<h2 className='title'>
								Выбери диапозон чисел, а я угадаю это число, перед этим сказав, сколько попыток мне
								потребуется
							</h2>
							<RangeSlider />
							<h2>Я угадаю число за {state.countTry} попыток или меньше</h2>
							<Button onClick={onPlay} variant='outlined'>
								Играть
							</Button>
						</Box>
					) : isPlay !== 'финиш' ? (
						<Box className='all-center'>
							<h2>Ваше число {state.possibleNumber}</h2>
							<Box>
								<Button onClick={() => onCondition(choice[0])} variant='outlined'>
									{choice[0]}
								</Button>
								<Button onClick={() => onFinish()} variant='outlined'>
									ДА
								</Button>
								<Button onClick={() => onCondition(choice[1])} variant='outlined'>
									{choice[1]}
								</Button>
							</Box>
							<h4>У меня осталось попыток: {state.countTry - state.attemptNumber}</h4>
						</Box>
					) : (
						// <CSSTransition in={true} timeout={200} classNames='my-node'>
						<Box className='all-center'>
							<h4>Попыток потрачено: {state.attemptNumber}</h4>
							<h2>Ваше число {state.possibleNumber}</h2>
							<Button onClick={() => onEnd()} variant='outlined'>
								ДА
							</Button>
						</Box>
						// </CSSTransition>
					)}
				</div>
			</Container>
		</Context.Provider>
	);
}

export default App;

export function createContext() {
	throw new Error('Function not implemented.');
}
