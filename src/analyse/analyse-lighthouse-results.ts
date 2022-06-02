import type { Result } from 'lighthouse/types/lhr/audit-result';
import { lighthouseCategoriesArray } from '../lighthouse/categories.js';
import { RunnerResultWrapper } from '../lighthouse/runner-results.js';
import type { LighthouseCategories } from '../options/types.js';

type LighthouseCategoryScores = Record<LighthouseCategories, number>;
export type LighthouseResultSummaryScores = Partial<LighthouseCategoryScores>;

export interface LighthouseResultSummary {
	name: string;
	url: string;
	htmlPath?: string;
	sizeDisplay: string;
	size: number;
	scores: LighthouseResultSummaryScores;
	mobile: boolean;
}

type LighthouseDetailsTableItem = {
	resourceType: string;
	transferSize?: number;
};

export interface LighthouseResultsSummary {
	data: Record<string, LighthouseResultSummary>;
	date: number;
}

/** Gets the total transfered size of a page (in KiB) */
const getPageSizeFromRunResult = (result: Result | undefined) => {
	if (!result) return 0;
	const { details } = result;
	if (details && details.type === 'table') {
		const total = (details.items as LighthouseDetailsTableItem[]).find(
			i => i.resourceType === 'total'
		);
		if (total) {
			return total.transferSize ?? 0;
		}
	}

	return 0;
};

/** Extracts the data that we are interested in
 * from the lighthouse audit results  */
export const analyseLighthouseResults = (
	runnerResults: Record<string, RunnerResultWrapper>,
	generatedHTMLFiles: Record<string, string>
): LighthouseResultsSummary => {
	const results: Record<string, LighthouseResultSummary> = {};
	const names = Object.keys(runnerResults);
	for (const name of names) {
		const runResult = runnerResults[name];
		if (!runResult) continue;
		const { result, type, url } = runResult;
		const resourceSummary = result.lhr.audits['resource-summary'];
		const sizeDisplay = resourceSummary?.displayValue ?? '';
		const size = getPageSizeFromRunResult(resourceSummary);

		const scores: LighthouseResultSummaryScores = {};
		for (const cat of lighthouseCategoriesArray) {
			const category = result.lhr.categories[cat];
			if (category) {
				scores[cat] = category.score ?? 0;
			}
		}

		const htmlPath = generatedHTMLFiles[name];

		const summaryResult: LighthouseResultSummary = {
			name,
			size,
			sizeDisplay,
			mobile: type === 'mobile',
			scores,
			htmlPath,
			url,
		};
		results[name] = summaryResult;
	}

	return {
		data: results,
		date: Date.now().valueOf(),
	};
};
