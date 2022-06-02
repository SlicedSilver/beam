import Ajv from 'ajv';
import { configurationJSONSchema, ConfigurationOptions } from './types.js';

const ajv = new Ajv();

const validate = ajv.compile(configurationJSONSchema);

export const validateConfigurationFile = (data: any) => {
	const valid = validate(data);
	const errors = valid ? [] : validate.errors;
	return [Boolean(valid), errors];
};

/**
 * Ensures that the lighthouse options within the user configuration is correct.
 * - If the lighthouse options is an array then the last item must be the fallback
 * - The fallback may not have the `targets` property set
 * - All other items should have a `targets` property
 */
export const validateLighthouseOptionsArray = (
	userConfiguration: ConfigurationOptions
): [boolean, string] => {
	if (!userConfiguration.lighthouse) return [true, ''];
	if (!Array.isArray(userConfiguration.lighthouse)) return [true, ''];
	const lastItem = userConfiguration.lighthouse.at(-1);
	if (!lastItem)
		return [
			false,
			'The `lighthouse` property within the configuration may not be an empty array.',
		];
	if (lastItem.targets)
		return [
			false,
			'The last item of the `lighthouse` property array within the configuration must be a fallback, and thus may not contain the `targets` property.',
		];
	if (userConfiguration.lighthouse.slice(0, -1).some(item => !item?.targets)) {
		return [
			false,
			'All entries (except the last) of the `lighthouse` property array must include the `targets` property.',
		];
	}

	return [true, ''];
};
