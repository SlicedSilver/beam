import chalk from 'chalk';
import { printTable } from 'console-table-printer';
import { LighthouseResultsSummary } from '../analyse/analyse-lighthouse-results.js';
import { LighthouseCategories } from '../options/types.js';

type TableRow = {
	URL: string;
	TYPE: string;
	Size: string;
	Perf?: string;
	SEO?: string;
	Acc?: string;
	'Best-P'?: string;
	PWA?: string;
};

const tableColumnScoreNames: Record<LighthouseCategories, keyof TableRow> = {
	performance: 'Perf',
	seo: 'SEO',
	accessibility: 'Acc',
	'best-practices': 'Best-P',
	pwa: 'PWA',
};

const colourScore = (score: number): string => {
	/* eslint-disable unicorn/no-nested-ternary */
	const chalkColour =
		score < 0.5 ? chalk.red : score < 0.9 ? chalk.yellow : chalk.green;
	/* eslint-enable unicorn/no-nested-ternary */
	const text = Math.round((score ?? 0) * 100)
		.toString()
		.padStart(3, ' ');
	return chalkColour(text);
};

export const printRunnerSummary = (results: LighthouseResultsSummary) => {
	console.log('');
	const tableResults: TableRow[] = [];
	for (const slugName in results.data) {
		if (!Object.prototype.hasOwnProperty.call(results.data, slugName)) continue;
		const run = results.data[slugName];
		if (!run) continue;
		const categories: LighthouseCategories[] = [
			'performance',
			'seo',
			'accessibility',
			'best-practices',
			'pwa',
		];
		/* eslint-disable @typescript-eslint/naming-convention */
		const row: TableRow = {
			URL: run.url,
			TYPE: run.mobile ? 'Mobile' : 'Desktop',
			Size: run.sizeDisplay.split('•')[1] ?? '',
		};
		/* eslint-enable @typescript-eslint/naming-convention */
		for (const cat of categories) {
			const score = run.scores[cat];
			if (score) {
				const columnName = tableColumnScoreNames[cat];
				row[columnName] = colourScore(score);
			}
		}

		tableResults.push(row);
	}

	printTable(tableResults);
};
