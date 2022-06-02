import React, { FC } from 'react';
import { Box, Spacer, Text } from 'ink';

type Shortcut = { key: string; action: string };

const keys: Shortcut[] = [
	{ key: 'h', action: 'Show / hide this help.' },
	{ key: 'tab', action: 'Change tab.' },
	{ key: 'up / down', action: 'Change item highlighted / selected.' },
	{ key: 'enter', action: 'Open report in browser.' },
	// { key: 'right', action: 'Show detailed information.' },
	{ key: '- / +', action: 'Change sort order (ascending / descending).' },
	{ key: 's', action: 'Change sort category.' },
	{ key: '[ / ]', action: 'Previous / next sort category.' },
];

export const HelpBox: FC = () => {
	const longestKey = Math.max(...keys.map(k => k.key.length));
	return (
		<Box flexDirection='column'>
			<Text bold underline color='white'>
				Keyboard Shortcuts
			</Text>
			<Box flexDirection='row'>
				<Box
					borderColor='white'
					borderStyle='round'
					padding={1}
					flexDirection='column'
					flexGrow={0}
				>
					{keys.map(shortcut => (
						<Box key={shortcut.key} flexDirection='row'>
							<Box width={longestKey} marginLeft={1} marginRight={4}>
								<Text color='cyan'>{shortcut.key}</Text>
							</Box>
							<Text>{shortcut.action}</Text>
						</Box>
					))}
				</Box>
				<Spacer />
			</Box>
		</Box>
	);
};
