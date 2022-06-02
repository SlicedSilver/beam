import test from 'ava';
import { loadConfigFile } from '../../configuration/configuration.js';

test('Should Load Example Config File', async t => {
	const c = await loadConfigFile('src/tests/configuration/examples/beam.json');
	t.is(
		JSON.stringify(c),
		'{"dist":"dist","output":{"html":true,"json":false,"folder":".beam"}}'
	);
});

test('Should NOT Load Missing Config File', async t => {
	await t.throwsAsync(async () =>
		loadConfigFile('src/tests/configuration/examples/NONE.json')
	);
});

test('Should NOT Load Invalid JSON File', async t => {
	await t.throwsAsync(async () =>
		loadConfigFile('src/tests/configuration/examples/not-valid-json.txt')
	);
});
