import React, { FC } from 'react';
import { Box, Text, Spacer } from 'ink';
import { TabNames } from './explorer';

export const ExplorerHeader: FC<{
	tabs: string[];
	selectedTab: TabNames;
	sortDescription: string;
}> = ({ tabs, selectedTab, sortDescription }) => (
	<Box flexDirection='row' marginRight={1}>
		{tabs.map(tab => {
			const selected = tab === selectedTab;
			return (
				<Box key={tab}>
					<Text backgroundColor={selected ? 'cyan' : ''}>{`  ${tab}  `}</Text>
				</Box>
			);
		})}
		<Spacer />
		<Text>{sortDescription}</Text>
	</Box>
);
