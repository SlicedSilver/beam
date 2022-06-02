import fs from 'node:fs/promises';
import process from 'node:process';
import ora from 'ora';
import type { OutputMode } from 'lighthouse/types/lhr/settings';
import type { Options } from '../options/types.js';
import { ensureDirectoryExistence } from '../fs/directory.js';
import { buildProgressBar } from '../ui/non-interactive/progress-bar.js';
import type { RunnerResultWrapper } from './runner-results.js';

export const saveReportsToDisk = async (
	runnerResults: Record<string, RunnerResultWrapper>,
	options: Options,
	outputs: OutputMode[]
) => {
	const generatedHtmlPaths: Record<string, string> = {};

	const spinner = ora({
		color: 'cyan',
	});

	const numberResults = Object.values(runnerResults).length;
	const filesBar = buildProgressBar(numberResults * outputs.length);

	spinner.start(`Saving Reports to Disk\n  ${filesBar(0)}`);

	try {
		const directory = `./${options.output.folder}`;
		if (!ensureDirectoryExistence(directory)) {
			await fs.mkdir(directory);
		}

		const cwd = process.cwd();
		let count = 0;
		for (const name in runnerResults) {
			if (!Object.prototype.hasOwnProperty.call(runnerResults, name)) continue;
			const runResult = runnerResults[name];
			if (!runResult) continue;
			const { result, type } = runResult;
			let reports = result.report;
			if (!reports) continue;
			if (typeof reports === 'string') {
				reports = [reports];
			}

			for (const [index, extension] of outputs.entries()) {
				spinner.text = `Saving Reports to Disk\n  ${filesBar(count)}`;
				const fileName = `${
					name.endsWith('-html') ? name.slice(0, -5) : name
				}-${type}-report`;
				const filePath = `${directory}/${fileName}.${extension}`;
				const content = reports[index] ?? '';
				/* eslint-disable no-await-in-loop */
				if (content) await fs.writeFile(filePath, content);
				/* eslint-enable no-await-in-loop */
				if (extension === 'html') {
					generatedHtmlPaths[name] = `${cwd}/${
						filePath.startsWith('./') ? filePath.slice(2) : filePath
					}`;
				}

				count += 1;
			}
		}

		spinner.succeed('Saved Reports to Disk.');
	} catch (error: unknown) {
		spinner.fail('Saving Reports to Disk Failed.');
		throw error;
	}

	return generatedHtmlPaths;
};
