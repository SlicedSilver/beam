import React, { FC } from 'react';
import { Box, Text, Spacer } from 'ink';

export const Header: FC<{ title?: string; helpVisible: boolean }> = ({
	title = 'Results',
	helpVisible,
}) => (
	<Box height={2}>
		<Text bold underline color='cyan'>
			{title}
		</Text>
		<Spacer />
		<Text dimColor>
			Press &lsquo;h&rsquo; to {helpVisible ? 'hide' : 'show'} help
		</Text>
	</Box>
);
