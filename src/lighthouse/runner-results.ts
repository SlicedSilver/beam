import type { RunnerResult } from 'lighthouse/types/externs';

export type RunTypes = 'mobile' | 'desktop';

export type RunnerResultWrapper = {
	result: RunnerResult;
	type: RunTypes;
	url: string;
};
