import test from 'ava';
import {
	validateConfigurationFile,
	validateLighthouseOptionsArray,
} from '../../configuration/validate.js';
import { defaultOptions } from '../../options/defaults.js';

test('Valid Config Passes', t => {
	const [ans] = validateConfigurationFile(defaultOptions);
	t.is(ans, true);
});

test('Invalid Config Fails: dist', t => {
	const [ans] = validateConfigurationFile({
		dist: 1234,
	});
	t.is(ans, false);
});

test('Invalid Config Fails: includes', t => {
	const [ans] = validateConfigurationFile({
		includes: '**/*.html', // Should be in an array
	});
	t.is(ans, false);
});

test('Invalid Config Fails: excludes', t => {
	const [ans] = validateConfigurationFile({
		excludes: '**/*.html', // Should be in an array
	});
	t.is(ans, false);
});

test('Invalid Config Fails: alwaysIncludes', t => {
	const [ans] = validateConfigurationFile({
		alwaysIncludes: '**/*.html', // Should be in an array
	});
	t.is(ans, false);
});

test('Invalid Config Fails: urls', t => {
	const [ans] = validateConfigurationFile({
		urls: '**/*.html', // Should be in an array
	});
	t.is(ans, false);
	const [ans2] = validateConfigurationFile({
		urls: [1, 2], // Should be strings
	});
	t.is(ans2, false);
});

test('Valid Lighthouse Array passes', t => {
	const [valid] = validateLighthouseOptionsArray({
		lighthouse: [
			{ targets: ['**/index.html'], mobile: true },
			{ desktop: true },
		],
	});
	t.is(valid, true);
});

test('Invalid Lighthouse Array fails', t => {
	// No `targets`
	const [valid] = validateLighthouseOptionsArray({
		lighthouse: [{ mobile: true }, { desktop: true }],
	});
	t.is(valid, false);

	// Last entry shouldn't have `targets`
	const [valid2] = validateLighthouseOptionsArray({
		lighthouse: [
			{ mobile: true, targets: ['index.html'] },
			{ desktop: true, targets: ['index.html'] },
		],
	});
	t.is(valid2, false);
});
