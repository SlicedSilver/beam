import {
	LighthouseResultsSummary,
	LighthouseResultSummary,
} from '../../analyse/analyse-lighthouse-results.js';
import { LighthouseCategories } from '../../options/types.js';

export const sortResults = (
	results: LighthouseResultsSummary,
	category: string,
	ascending: boolean
): LighthouseResultSummary[] => {
	const runResults = Object.values(results.data);
	if (category === 'path') {
		if (ascending) runResults.reverse();
	} else if (category === 'size') {
		runResults.sort((a, b) => {
			const direction = a.size - b.size;
			return ascending ? direction : direction * -1;
		});
	} else {
		const sortCategory = category as LighthouseCategories;
		runResults.sort((a, b) => {
			const direction =
				(a.scores[sortCategory] ?? 0) - (b.scores[sortCategory] ?? 0);
			return ascending ? direction : direction * -1;
		});
	}

	return runResults;
};

export const getSortCategories = (
	results: LighthouseResultsSummary
): string[] => {
	const cats: Set<string> = new Set(['path']);
	const runResults = Object.values(results.data);
	for (const run of runResults) {
		const runCats = Object.keys(run.scores);
		for (const cat of runCats) cats.add(cat);
	}

	return [...cats];
};
