import test from 'ava';

test('simple test', t => {
	const a = 2;
	const b = 5;
	const answer = a + b;

	t.is(answer, 7);
});
