import React, { FC, useEffect, useState } from 'react';
import { Box, useInput } from 'ink';
import figures from 'figures';
import open from 'open';
import {
	LighthouseResultsSummary,
	LighthouseResultSummary,
} from '../../analyse/analyse-lighthouse-results.js';
import { LighthouseCategories } from '../../options/types.js';
import { categoryTitles } from '../../lighthouse/categories.js';
import { useListIndex, useListItem } from '../hooks/use-list-item.js';
import { ExplorerHeader } from './header.js';
import { ExplorerTable } from './table.js';
import { getSortCategories, sortResults } from './sorting.js';

export type TabNames = 'Lighthouse Scores' | 'Page Sizes';
const tabs: TabNames[] = ['Lighthouse Scores', 'Page Sizes'];

export const Explorer: FC<{ results: LighthouseResultsSummary }> = ({
	results,
}) => {
	const [selectedTab, previousTab, nextTab] = useListItem<TabNames>(
		tabs,
		tabs[0]!,
		{
			loops: true,
		}
	);
	const [ascending, setAscending] = useState<boolean>(false);
	const [sortCategories, setSortCategories] = useState<string[]>([]);
	const [sortCat, previousSortCat, nextSortCat] = useListItem(
		sortCategories,
		'path',
		{ loops: true }
	);
	const [sortedResults, setSortedResults] = useState<LighthouseResultSummary[]>(
		[]
	);
	const [selectedIndex, previousItem, nextItem] = useListIndex(sortedResults);

	useEffect(() => {
		if (selectedTab === 'Page Sizes') {
			setSortCategories(['path', 'size']);
			return;
		}

		setSortCategories(getSortCategories(results));
	}, [results, selectedTab]);

	const [sortDescription, setSortDescription] = useState('');
	useEffect(() => {
		setSortDescription(
			`${ascending ? figures.arrowUp : figures.arrowDown} ${
				categoryTitles[sortCat as LighthouseCategories] ?? 'Path'
			}`
		);
		setSortedResults(sortResults(results, sortCat, ascending));
	}, [ascending, sortCat, results]);

	useInput(async (input, key) => {
		if (key.tab) {
			if (key.shift) {
				previousTab();
			} else {
				nextTab();
			}
		}

		if (input === '-') setAscending(false);
		if (input === '=') setAscending(true);

		if (key.upArrow) previousItem();
		if (key.downArrow) nextItem();

		if (input === 's' || input === ']') nextSortCat();
		if (input === '[') previousSortCat();

		if (key.return) {
			const selectedResult = sortedResults[selectedIndex];
			if (selectedResult?.htmlPath) {
				void open(selectedResult.htmlPath);
			}
		}
	});

	return (
		<Box flexDirection='column'>
			<ExplorerHeader
				tabs={tabs}
				sortDescription={sortDescription}
				selectedTab={selectedTab}
			/>
			<ExplorerTable
				results={sortedResults}
				selectedIndex={selectedIndex}
				selectedCategory={sortCat ?? 'path'}
				selectedTab={selectedTab}
			/>
		</Box>
	);
};
