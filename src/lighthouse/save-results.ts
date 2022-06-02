import fs from 'node:fs/promises';
import { ensureDirectoryExistence } from '../fs/directory.js';
import { LighthouseResultsSummary } from '../analyse/analyse-lighthouse-results.js';
import { saveJSONFile } from '../fs/json.js';

/**
 * Saves the summary results for all the runs to local output folder
 * - This file is used when the cli is started with the `viewlast` flag as a way
 * to view and explore the results without running all the tests again.
 */
export const saveResultsToDisk = async (
	results: LighthouseResultsSummary,
	folder: string
) => {
	const directory = `./${folder}`;
	if (!ensureDirectoryExistence(directory)) {
		await fs.mkdir(directory);
	}

	const filePath = `${directory}/.last-results.json`;
	await saveJSONFile(filePath, results);
};
