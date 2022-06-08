#!/usr/bin/env node
import type { ErrorObject } from 'ajv';
import meow from 'meow';
import { LighthouseResultsSummary } from './analyse/analyse-lighthouse-results.js';
import { startApp } from './ui/app/app.js';
import { loadConfigFile } from './configuration/configuration.js';
import { mergeConfigurations } from './configuration/merge.js';
import {
	validateConfigurationFile,
	validateLighthouseOptionsArray,
} from './configuration/validate.js';
import {
	errorMessage,
	infoMessage,
	printLines,
	printMessage,
} from './console/print.js';
import { validateFlags } from './flags/validate.js';
import { ensureDirectoryExistence } from './fs/directory.js';
import { ensureFileExistence } from './fs/file.js';
import { loadJSONFile } from './fs/json.js';
import { printRunnerSummary } from './runner/print-summary.js';
import { runner } from './runner/runner.js';
import { setupWizard } from './setup/setup.js';
import { renderSplash } from './ui/non-interactive/splash.js';

const cli = meow(
	`
	Usage
	  $ beam

	Options
    	--setup -s		Setup and Create a new Beam configuration file
		--config -c		Path to Beam configuration file
    	--dist -d		Path to Build Directory
    	--urls -u		Comma-seperated list of URLs to test
    	--port -p		Server Port Number
    	--no-gui		Skip Interactive Results Viewer GUI
		--viewlast		Skip Tests and View Last Results in GUI
		--version		Display Version
		--help			Display this Help Message


	Examples
		$ beam --setup
	  	Setup Beam for a new project

		$ beam -d ./dist
		Run Beam on the dist folder
`,
	{
		importMeta: import.meta,
		flags: {
			setup: {
				alias: 's',
				type: 'boolean',
				default: false,
			},
			config: {
				alias: 'c',
				type: 'string',
			},
			dist: {
				alias: 'd',
				type: 'string',
			},
			urls: {
				alias: 'u',
				type: 'string',
			},
			port: {
				alias: 'p',
				type: 'number',
			},
			gui: {
				type: 'boolean',
				default: true,
			},
			viewlast: {
				type: 'boolean',
				default: false,
			},
		},
	}
);

const main = async () => {
	try {
		renderSplash();

		const validFlags = await validateFlags(cli.input, cli.flags);
		if (!validFlags) return;
		if (cli.flags.setup) {
			await setupWizard();
			return; // Exit when done
		}

		const userConfiguration = await loadConfigFile(cli.flags.config);
		const hasUserConfiguration = Object.keys(userConfiguration).length > 0;
		const [validConfigFile, validationErrors] =
			validateConfigurationFile(userConfiguration);
		if (!validConfigFile) {
			errorMessage('Error validating contents of the user configuration file.');
			if (validationErrors) {
				for (const ajvError of validationErrors as ErrorObject[]) {
					printMessage(
						`  ${ajvError.instancePath}: ${ajvError.keyword} ${
							ajvError.message ?? ''
						}`
					);
				}
			}

			return;
		}

		const [passArrayCheck, arrayErrorMessage] =
			validateLighthouseOptionsArray(userConfiguration);
		if (!passArrayCheck) {
			errorMessage(arrayErrorMessage);
			return;
		}

		const config = mergeConfigurations(cli.flags, userConfiguration);
		const distFolderExists = ensureDirectoryExistence(config.dist);
		if (!distFolderExists) {
			errorMessage('Folder containing static files not found');
			if (!hasUserConfiguration) {
				infoMessage('You can configure beam by running `beam --setup`');
			}

			return;
		}

		let lighthouseResults: LighthouseResultsSummary | undefined;

		if (cli.flags.viewlast) {
			const filePath = `${config.output.folder}/.last-results.json`;
			const lastResultsExists = ensureFileExistence(filePath);
			if (!lastResultsExists) {
				errorMessage('Unable to find last results file.');
				printLines([
					'',
					'Possible reasons:',
					"* You haven't run Beam yet within this project.",
					'* Beam is configured to not save any reports. (Try running setup again)',
					'',
				]);
				return;
			}

			lighthouseResults = (await loadJSONFile(
				filePath
			)) as unknown as LighthouseResultsSummary;
		}

		if (!cli.flags.viewlast) {
			lighthouseResults = await runner(config);
		}

		if (cli.flags.gui) {
			if (!lighthouseResults) {
				errorMessage('No Results Collected');
				return;
			}

			printLines(['', '']);
			const { clear, waitUntilExit } = startApp({ results: lighthouseResults });
			await waitUntilExit();
			clear();
		} else if (lighthouseResults) printRunnerSummary(lighthouseResults);
	} catch (error: unknown) {
		if (error instanceof Error) {
			errorMessage(error.message);
		}
	}
};

void main();
