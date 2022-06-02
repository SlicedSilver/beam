import test from 'ava';
import { mergeConfigurations } from '../../configuration/merge.js';
import { buildUrlsList } from '../../runner/urls.js';

test('Finds all html files', async t => {
	const options = mergeConfigurations(
		{},
		{ include: ['**/*.html'], dist: 'src/tests/test_dist' }
	);
	const urls = await buildUrlsList(options);
	t.is(urls.length, 4);
});

test('Excludes', async t => {
	const options = mergeConfigurations(
		{},
		{
			include: ['**/*.html'],
			dist: 'src/tests/test_dist',
			exclude: ['**/404.html'],
		}
	);
	const urls = await buildUrlsList(options);
	t.is(urls.length, 3);
});

test('alwaysIncludes Overrides Excludes', async t => {
	const options = mergeConfigurations(
		{},
		{
			include: ['**/*.html'],
			dist: 'src/tests/test_dist',
			exclude: ['**/404.html'],
			alwaysInclude: ['**/404.html'],
		}
	);
	const urls = await buildUrlsList(options);
	t.is(urls.length, 4);
});

test('URLs overrides', async t => {
	const options = mergeConfigurations(
		{},
		{
			include: ['**/*.html'],
			dist: 'src/tests/test_dist',
			urls: ['index.html', 'second.html'],
		}
	);
	const urls = await buildUrlsList(options);
	t.is(urls.length, 2);
});
