import React, { FC, useState } from 'react';
import { Text, Box, useInput, useApp, render } from 'ink';
import { delay } from '../../utils/delay.js';
import { LighthouseResultsSummary } from '../../analyse/analyse-lighthouse-results.js';
import { Explorer } from '../explorer/explorer.js';
import { Header } from './header.js';
import { HelpBox } from './help.js';

export const App: FC<{ results: LighthouseResultsSummary }> = ({ results }) => {
	const [showHelp, setShowHelp] = useState(false);
	const [quitting, setQuitting] = useState(false);

	const { exit } = useApp();

	useInput(async (input, key) => {
		if (input === 'q' || key.escape) {
			setQuitting(true);
			await delay(1);
			exit();
		}

		if (input === 'h') {
			setShowHelp(!showHelp);
		}
	});

	if (quitting) return <Text> 👋 Good-bye</Text>;

	return (
		<Box paddingX={1} paddingBottom={1} flexDirection='column'>
			<Header helpVisible={showHelp} title='Results Explorer' />
			{showHelp ? <HelpBox /> : <Explorer results={results} />}
		</Box>
	);
};

export const startApp = ({ results }: { results: LighthouseResultsSummary }) =>
	render(<App results={results} />, {});
