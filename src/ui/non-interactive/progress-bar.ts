import chalk from 'chalk';
import gradient from 'gradient-string';

export const buildProgressBar = (
	numberItems: number,
	maxWidth = 40,
	minWidth = 10
) => {
	const complete = '█';
	const incomplete = '⣀';
	let width = numberItems * 2;
	if (width > maxWidth) width = maxWidth;
	if (width < minWidth) width = minWidth;
	return (count: number) => {
		const completed = Math.round((count / numberItems) * width);
		const incompleted = width - completed;
		let bar = '';
		for (let i = 0; i < completed; i++) bar += complete;
		for (let i = 0; i < incompleted; i++) bar += incomplete;
		bar = `|${gradient.morning(bar)}| ${count} / ${numberItems} `;
		return chalk.green(bar);
	};
};
