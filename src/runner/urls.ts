import { globby } from 'globby';
import type { Options } from '../options/types.js';

export const buildUrlsList = async (options: Options): Promise<string[]> => {
	if (options.urls && options.urls.length > 0) return options.urls;

	const files = await globby(options.include, {
		ignore: options.exclude ?? [],
		cwd: options.dist,
	});
	const requiredFiles = await globby(options.alwaysInclude ?? [], {
		cwd: options.dist,
	});

	const fileSet = new Set<string>([...files, ...requiredFiles]);

	if (fileSet.size === 0) {
		return [];
	}

	return [...fileSet.values()];
};
