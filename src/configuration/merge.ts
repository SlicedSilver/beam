import type { Flags } from '../flags/validate.js';
import type { LighthouseOptions, Options } from '../options/types.js';
import { defaultOptions } from '../options/defaults.js';
import type { ConfigurationOptions } from './types.js';

/** Build up the configuration options
 *
 * Order of Preference (lowest -> highest):
 * Defaults -> Config File -> Flags
 */
export const mergeConfigurations = (
	flags: Flags,
	userConfiguration: ConfigurationOptions
): Options => {
	let { lighthouse } = defaultOptions;
	if (userConfiguration.lighthouse) {
		if (Array.isArray(userConfiguration.lighthouse)) {
			/* eslint-disable @typescript-eslint/consistent-type-assertions */
			// ? Disabling the eslint rule for a cleaner and small section of code.
			lighthouse = userConfiguration.lighthouse.map(
				lhc =>
					({
						...(defaultOptions.lighthouse as LighthouseOptions),
						...lhc,
					} as LighthouseOptions)
			);
			/* eslint-enable @typescript-eslint/consistent-type-assertions */
		} else {
			lighthouse = {
				...(defaultOptions.lighthouse as LighthouseOptions),
				...(userConfiguration.lighthouse as LighthouseOptions),
			};
		}
	}

	const options = {
		...defaultOptions,
		...userConfiguration,
		server: { ...defaultOptions.server, ...userConfiguration.server },
		output: { ...defaultOptions.output, ...userConfiguration.output },
		lighthouse,
	};
	if (flags.dist) options.dist = flags.dist;
	if (flags.port) options.server.port = flags.port;
	if (flags.urls) options.urls = flags.urls.split(',');
	return options as Options;
};
