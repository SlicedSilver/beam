import ora from 'ora';
import lighthouse from 'lighthouse';
import speakingurl from 'speakingurl';
import type { OutputMode } from 'lighthouse/types/lhr/settings';
import type { Flags, RunnerResult } from 'lighthouse/types/externs';
import chalk from 'chalk';
import desktopConfig from 'lighthouse/lighthouse-core/config/desktop-config.js';
import multimatch from 'multimatch';
import puppeteer from 'puppeteer';
import type { JsonObject } from 'type-fest';
import type { Target } from 'puppeteer';
import type {
	LighthouseOptions,
	MediaFeature,
	Options,
} from '../options/types.js';
import { analyseLighthouseResults } from '../analyse/analyse-lighthouse-results.js';
import { buildProgressBar } from '../ui/non-interactive/progress-bar.js';
import type { RunnerResultWrapper, RunTypes } from './runner-results.js';
import { saveReportsToDisk } from './save-reports.js';
import { saveResultsToDisk } from './save-results.js';

/**
 * Build the Flags object required for Lighthouse.
 */
const buildLighthouseFlags = (
	port: number,
	selectedLighthouseOptions: LighthouseOptions,
	output: OutputMode[]
) => {
	const categories =
		selectedLighthouseOptions.categories === 'all'
			? undefined
			: selectedLighthouseOptions.categories;
	const lighthouseFlags: Flags = {
		logLevel: 'silent',
		output,
		onlyCategories: categories,
		port,
	};
	const runTypes: RunTypes[] = [];
	if (selectedLighthouseOptions.desktop) runTypes.push('desktop');
	if (selectedLighthouseOptions.mobile || runTypes.length === 0)
		runTypes.push('mobile');
	return { lighthouseFlags, runTypes };
};

/**
 * Picks the relevent Lighthouse Options for the specified URL.
 */
const pickLighthouseOptions = (
	urlPath: string,
	options: Options
): LighthouseOptions | undefined => {
	if (!Array.isArray(options.lighthouse)) return options.lighthouse;
	const config = options.lighthouse.find(cfg => {
		if (!cfg.targets) return true;
		return multimatch(urlPath, cfg.targets).length > 0;
	});
	return config;
};

/**
 * Builds the string which will be evaluated within the
 * puppeteer page as it is opened.
 * The eval string will set the `pageWindowFlags` from the
 * lighthouse options as varibles on the 'window' (global).
 * @param flags
 * @returns
 */
const puppeteerWindowFlagCommands = (flags: JsonObject) => `
	var __puppeteerFlags = JSON.parse('${JSON.stringify(flags)}');
	for (const k in __puppeteerFlags) {
		window[k] = __puppeteerFlags[k];
	}
	`;

interface TestRun {
	url: string;
	lighthouseFlags: Flags;
	runType: RunTypes;
	mediaFeatures?: MediaFeature[];
	pageWindowFlags?: JsonObject;
}

const determineTestsToRun = (
	urls: string[],
	options: Options,
	chromePort: number,
	output: OutputMode[]
) => {
	const testsToRun: TestRun[] = [];
	for (const url of urls) {
		const selectedLighthouseOptions = pickLighthouseOptions(url, options);
		const { lighthouseFlags, runTypes } = buildLighthouseFlags(
			chromePort,
			selectedLighthouseOptions!,
			output
		);
		for (const runType of runTypes) {
			testsToRun.push({
				runType,
				lighthouseFlags,
				url,
				mediaFeatures: selectedLighthouseOptions?.mediaFeatures,
				pageWindowFlags: selectedLighthouseOptions?.pageWindowFlags,
			});
		}
	}

	return testsToRun;
};

export const runLighthouseAudits = async (
	urls: string[],
	port: number,
	options: Options
) => {
	const spinner = ora({
		color: 'cyan',
	});

	let browser: puppeteer.Browser | undefined;
	let chromePort = 0;
	try {
		spinner.start('Launching Chrome (headless)');
		browser = await puppeteer.launch({
			headless: true,
			defaultViewport: null,
		});
		chromePort = Number.parseInt(new URL(browser.wsEndpoint()).port, 10);
		spinner.succeed('Launched Chrome (headless).');
	} catch {
		spinner.fail('Error launching Chrome');
	}

	if (!browser || !chromePort) return;

	const output: OutputMode[] = [];
	if (options.output.folder) {
		if (options.output.html) output.push('html');
		if (options.output.json) output.push('json');
	}

	const testsToRun: TestRun[] = determineTestsToRun(
		urls,
		options,
		chromePort,
		output
	);

	const bar = buildProgressBar(testsToRun.length);
	spinner.start(`Running Lighthouse Tests\n  ${bar(0)}`);

	const startTime = Date.now().valueOf();
	const runnerResults: Record<string, RunnerResultWrapper> = {};
	try {
		let count = 0;
		for (const testRun of testsToRun) {
			const { url, runType, lighthouseFlags, mediaFeatures, pageWindowFlags } =
				testRun;
			spinner.text = `Running Lighthouse Tests\n  ${bar(count)} ${chalk.grey(
				url
			)} (${runType})`;
			const fullUrl = `http://localhost:${port}/${url}`;
			const slug = `${speakingurl(url)}-${runType}`;
			const config =
				runType === 'desktop'
					? (desktopConfig as Record<string, unknown>)
					: undefined;

			browser.once('targetchanged', async (target: Target) => {
				const page = await target.page();
				if (!page) return;
				if (mediaFeatures) {
					await page.emulateMediaFeatures(mediaFeatures);
				}

				if (pageWindowFlags) {
					await page.evaluate(puppeteerWindowFlagCommands(pageWindowFlags));
				}
			});

			// ! Don't have full typing for this import, thus disabling compiler checks
			/* eslint-disable no-await-in-loop */
			/* eslint-disable @typescript-eslint/no-unsafe-call */
			const runResult = (await lighthouse(
				fullUrl,
				lighthouseFlags,
				config
			)) as RunnerResult;
			/* eslint-enable @typescript-eslint/no-unsafe-call */
			/* eslint-enable no-await-in-loop */

			runnerResults[slug] = {
				result: runResult,
				type: runType,
				url,
			};
			count += 1;
		}

		const endTime = Date.now().valueOf();
		const duration = Math.round((endTime - startTime) / 100) / 10;
		spinner.succeed(`Lighthouse Tests Completed. [${duration} s]`);
	} catch (error: unknown) {
		spinner.fail('Tests aborted.');
		throw error;
	} finally {
		spinner.start('Closing Chrome');
		await browser.close();
		spinner.succeed('Closed Chrome.');
	}

	let generatedHtmlPaths = {};
	if (output && output.length > 0) {
		generatedHtmlPaths = await saveReportsToDisk(
			runnerResults,
			options,
			output
		);
	}

	const results = analyseLighthouseResults(runnerResults, generatedHtmlPaths);
	if (output && output.length > 0 && options.output.folder) {
		await saveResultsToDisk(results, options.output.folder);
	}

	return results;
};
