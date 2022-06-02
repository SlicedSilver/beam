import test from 'ava';
import { mergeConfigurations } from '../../configuration/merge.js';
import { defaultOptions } from '../../options/defaults.js';

test('Use Defaults', t => {
	const c = mergeConfigurations({}, {});
	t.is(JSON.stringify(c), JSON.stringify(defaultOptions));
});

test('Config file overrides', t => {
	const c = mergeConfigurations(
		{},
		{ dist: 'testing', output: { folder: 'testing' } }
	);
	t.is(c.dist, 'testing');
	t.is(c.output.folder, 'testing');
});

test('CLI Flags', t => {
	const c = mergeConfigurations(
		{ dist: 'cli', urls: 'index.html' },
		{ dist: 'testing', output: { folder: 'testing' } }
	);
	t.is(c.dist, 'cli');
	t.is(c.output.folder, 'testing');
	t.deepEqual(c.urls, ['index.html']);
});
