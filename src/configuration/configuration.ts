import { ensureFileExistence } from '../fs/file.js';
import { loadJSONFile } from '../fs/json.js';
import { ConfigurationOptions } from './types.js';

export const loadConfigFile = async (
	path?: string
): Promise<ConfigurationOptions> => {
	if (path) {
		const exists = ensureFileExistence(path);
		if (!exists) {
			throw new Error(
				'Unable to find config file specified within command flags.'
			);
		}
	}

	const configPath = path ?? '.beam.json';
	const exists = ensureFileExistence(configPath);
	if (!exists) return {};
	try {
		return (await loadJSONFile(configPath)) as ConfigurationOptions;
	} catch {
		throw new Error(
			`Unable to load and parse configuration file at: ${configPath}`
		);
	}
};
