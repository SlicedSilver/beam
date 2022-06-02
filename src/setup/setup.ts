import fsPromises from 'node:fs/promises';
import enquirerPkg from 'enquirer';
import ora from 'ora';
import chalk from 'chalk';
import type { ConfigurationOptions } from '../configuration/types.js';
import { errorMessage, printLines, warningMessage } from '../console/print.js';
import { defaultOptions } from '../options/defaults.js';
import { saveJSONFile } from '../fs/json.js';
import { ensureFileExistence } from '../fs/file.js';
import { LighthouseCategories } from '../options/types.js';

const { prompt } = enquirerPkg;

/**
 * Gets the list of folders within the current working directory
 * @returns string array of folder paths
 */
const getListOfFolders = async () => {
	const filesAndFolders = await fsPromises.readdir('./', {
		withFileTypes: true,
	});
	const folders = filesAndFolders
		.filter(item => item.isDirectory())
		.map(item => item.name);
	return folders;
};

const askYesNo = async (
	message: string,
	initial?: boolean
): Promise<boolean> => {
	const response = await prompt<{ answer: string }>({
		type: 'select',
		name: 'answer',
		message,
		choices: initial ? ['Yes', 'No'] : ['No', 'Yes'],
	});
	return response.answer === 'Yes';
};

const appendToGitIgnore = async (
	gitIgnoreFilePath: string,
	content: string
) => {
	const spinner = ora({
		text: 'Updating .gitignore',
		color: 'cyan',
	});
	spinner.start();
	try {
		let gitIgnoreContents = await fsPromises.readFile(
			gitIgnoreFilePath,
			'utf8'
		);
		gitIgnoreContents += content;
		await fsPromises.writeFile(gitIgnoreFilePath, gitIgnoreContents, 'utf8');
		spinner.succeed('Updated .gitignore');
	} catch (error: unknown) {
		spinner.fail('Unable to edit gitignore');
		if (error instanceof Error) {
			errorMessage(error.message);
		}
	}
};

export const setupWizard = async () => {
	const configuration: ConfigurationOptions = {};

	printLines([
		'This setup utility will walk you through creating a configuration file.',
		'It only covers the most common items, and tries to guess sensible defaults.',
		'',
		'Press ^C at any time to quit.',
		'',
	]);

	const folders = await getListOfFolders();
	const customFolderString = '[other...]';
	folders.push(customFolderString);

	const { folder } = await prompt<{ folder: string }>({
		type: 'select',
		name: 'folder',
		message: 'Please select your build directory:',
		choices: folders,
	});

	let selectedFolder = folder;
	if (folder === customFolderString) {
		const { dist } = await prompt<{ dist: string }>({
			type: 'input',
			name: 'dist',
			message: 'Please enter the relative path to your build directory:',
			initial: defaultOptions.dist,
			validate: (ans: string) =>
				ans.length > 0 ? true : 'Please enter a value',
		});
		selectedFolder = dist;
	}

	configuration.dist = selectedFolder;

	const presets = await prompt<{ presets: string[] }>({
		type: 'multiselect',
		name: 'presets',
		message: 'Please select which Lighthouse presets to run:',
		initial: 0,
		choices: [
			{
				name: 'mobile',
				message: 'Mobile',
				hint: 'Simulate a Mobile Device (Phone)',
			},
			{
				name: 'desktop',
				message: 'Desktop',
				hint: 'Simulate a Desktop Computer',
			},
		],
		validate: ans =>
			ans.length > 0 ? true : 'Please select at least one preset',
	});

	const all = await askYesNo(
		'Would you like to run all the audit categories provided by Lighthouse?',
		true
	);
	let categoriesAnswer: LighthouseCategories[] | 'all' = all
		? 'all'
		: ['performance'];
	if (!all) {
		const categories = await prompt<{ categories: LighthouseCategories[] }>({
			type: 'multiselect',
			name: 'categories',
			message: 'Please select which Lighthouse categories to run:',
			initial: 0,
			choices: [
				{ message: 'Performance', name: 'performance', hint: '' },
				{ message: 'Best Practices', name: 'best-practices', hint: '' },
				{ message: 'Accessibility', name: 'accessibility', hint: 'A11y' },
				{ message: 'SEO', name: 'seo', hint: 'Search Engine Optimisation' },
				{ message: 'PWA', name: 'pwa', hint: 'Progressive Web App' },
			],
			validate: ans =>
				ans.length > 0 ? true : 'Please select at least one category',
		});
		categoriesAnswer = categories.categories;
	}

	configuration.lighthouse = {
		mobile: presets.presets.includes('mobile'),
		desktop: presets.presets.includes('desktop'),
		categories: categoriesAnswer,
	};

	const html = await askYesNo(
		'Would you like keep HTML reports generated by Lighthouse:',
		defaultOptions.output.html
	);
	const json = await askYesNo(
		'Would you like keep JSON reports generated by Lighthouse:',
		defaultOptions.output.json
	);
	configuration.output = { html, json };

	if (html || json) {
		const { destination } = await prompt<{ destination: string }>({
			type: 'input',
			name: 'destination',
			message: 'Please enter the destination folder for storing the reports:',
			initial: defaultOptions.output.folder,
			validate: (ans: string) =>
				ans.length > 0 ? true : 'Please enter a value',
		});
		configuration.output.folder = destination;

		const gitIgnoreFilePath = '.gitignore';
		const gitIgnoreExists = ensureFileExistence(gitIgnoreFilePath);
		if (gitIgnoreExists) {
			const editGitIgnore = await askYesNo(
				'Would you like to add this folder to your .gitignore?',
				false
			);
			if (editGitIgnore) {
				await appendToGitIgnore(
					gitIgnoreFilePath,
					`\n# Beam Results Folder\n${destination}\n`
				);
			}
		}
	}

	printLines([
		'',
		'This setup utility will now create and save the configuration file.',
	]);
	warningMessage('Note: this will override any file with a matching name.');
	console.log('');

	const { fileName } = await prompt<{ fileName: string }>({
		type: 'input',
		name: 'fileName',
		message: 'Please enter a file name for the configuration file:',
		initial: '.beam.json',
		validate(ans: string) {
			if (ans.length === 0) return 'Please enter a value';
			if (ans.length < 6 || !ans.endsWith('.json')) {
				return 'File should end with the `.json` file extension';
			}

			return true;
		},
	});

	const spinner = ora({
		text: 'Saving configuration file',
		color: 'cyan',
	});
	spinner.start();
	await saveJSONFile(fileName, configuration);
	spinner.succeed('Configuration file saved');

	printLines([
		'',
		'You can now run Beam with the following command:',
		`$ ${chalk.cyan(
			`beam ${fileName === '.beam.json' ? '' : `-c ${fileName}`}`
		)}`,
		'',
	]);
};