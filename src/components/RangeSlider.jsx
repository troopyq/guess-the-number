import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Context } from 'context';

export default function RangeSlider() {
	const [param, setParam] = useState({ min: 1, max: 1048 });
	const { setState, state } = useContext(Context);
	const handleChange = (event, newValue) => {
		if (newValue[0] === param.max) {
			setState((prev) => ({ ...prev, sliderValue: [newValue[1] - 1, newValue[1]] }));
			return;
		}
		if (newValue[1] === param.min) {
			setState((prev) => ({ ...prev, sliderValue: [newValue[0], newValue[0] + 1] }));
			return;
		}

		setState((prev) => ({ ...prev, sliderValue: newValue }));
	};
	function valuetext(value) {
		return `${value} попыток`;
	}

	useEffect(() => {
		const diff = state.sliderValue[1] - state.sliderValue[0] + 1;
		if (diff) {
			const countTry = Math.floor(Math.log2(diff)) + 1;
			console.log('степень: ', countTry);
			setState((prev) => ({ ...prev, countTry }));
		} else {
			setState((prev) => ({ ...prev, countTry: 2 }));
		}
	}, [state.sliderValue]);

	return (
		<Box className='mb-20 slider' sx={{ width: 500 }}>
			<Slider
				getAriaLabel={() => 'Диапазон чисел'}
				value={state.sliderValue}
				min={param.min}
				max={param.max}
				step={1}
				name='Диапозон чисел'
				onChange={handleChange}
				valueLabelDisplay='on'
				getAriaValueText={valuetext}
			/>
		</Box>
	);
}
