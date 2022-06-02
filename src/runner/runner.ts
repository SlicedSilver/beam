import ora from 'ora';
import type { Options } from '../options/types.js';
import { delay } from '../utils/delay.js';
import { initialiseServer } from '../server/server.js';
import { runLighthouseAudits } from '../lighthouse/lighthouse.js';
import { LighthouseResultsSummary } from '../analyse/analyse-lighthouse-results.js';
import { buildUrlsList } from './urls.js';

export const runner = async (options: Options) => {
	const spinner = ora({
		text: 'Finding URLs',
		color: 'cyan',
	});
	spinner.start();
	const urls = await buildUrlsList(options);
	if (urls.length === 0) {
		spinner.fail('Found 0 URLs');
	} else {
		spinner.succeed(`Found ${urls.length} URLs for testing`);
	}

	if (urls.length === 0) {
		throw new Error('No URLs to test.');
	}

	const { server, port } = await initialiseServer(options);
	await delay(1000);
	let results: LighthouseResultsSummary | undefined;
	try {
		results = await runLighthouseAudits(urls, port, options);
	} finally {
		const spinner = ora({
			text: 'Closing Server',
			color: 'cyan',
		});
		spinner.start();
		await server.stop();
		spinner.succeed('Server Closed');
	}

	return results;
};
