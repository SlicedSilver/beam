import React, { FC, useEffect, useState } from 'react';
import { Box, Spacer, Text } from 'ink';
import figures from 'figures';
import useDimensions from 'ink-use-stdout-dimensions';
import {
	LighthouseResultSummary,
	LighthouseResultSummaryScores,
} from '../../analyse/analyse-lighthouse-results.js';
import {
	categoryTitles,
	lighthouseCategoriesArray,
} from '../../lighthouse/categories.js';
import { TabNames } from './explorer.js';

const determineColour = (score: number): string => {
	if (score < 0.5) return 'red';
	if (score < 0.9) return 'yellow';
	return 'green';
};

const scoreColumnWidth = 6;
const presetColumnWidth = 9;

const LighthouseScore: FC<{ score: number }> = ({ score }) => {
	if (score < 0) return <Text>{''.padEnd(scoreColumnWidth, ' ')}</Text>;
	const colour = determineColour(score);
	const scoreText = Math.round(score * 100).toString();
	return (
		<Text color={colour}>
			{scoreText
				.padStart(scoreColumnWidth - 1, ' ')
				.padEnd(scoreColumnWidth, ' ')}
		</Text>
	);
};

const LighthouseScores: FC<{ scores: LighthouseResultSummaryScores }> = ({
	scores,
}) => {
	const scoreValues = lighthouseCategoriesArray.map(cat => scores[cat] ?? -1);
	return (
		<>
			{scoreValues.map((score, index) => (
				/* eslint-disable react/no-array-index-key */
				// ! Disabled rule there is nothing unique about each item.
				<LighthouseScore key={index} score={score} />
				/* eslint-enable react/no-array-index-key */
			))}
		</>
	);
};

const MetricTitles: FC<{ selectedTab: TabNames; selectedCategory: string }> = ({
	selectedCategory,
	selectedTab,
}) => {
	if (selectedTab === 'Page Sizes')
		return (
			<Text underline={selectedCategory !== 'path'}>Transfer Size (KiB)</Text>
		);
	return (
		<>
			{lighthouseCategoriesArray.map(cat => {
				const selected = cat === selectedCategory;
				return (
					<Text key={cat} underline={selected}>
						{categoryTitles[cat]
							.slice(0, scoreColumnWidth - 2)
							.toUpperCase()
							.padStart(scoreColumnWidth - 1, ' ')
							.padEnd(scoreColumnWidth, ' ')}
					</Text>
				);
			})}
		</>
	);
};

/* eslint-disable no-mixed-operators */
const calculateMaxUrlLength = (columns: number): number =>
	columns - 12 - 5 * scoreColumnWidth - presetColumnWidth;
/* eslint-enable no-mixed-operators */

const truncateUrl = (url: string, maxLength: number) => {
	if (url.length <= maxLength) return url;
	return `${url.slice(0, maxLength - 3)}...`;
};

export const ExplorerTable: FC<{
	results: LighthouseResultSummary[];
	selectedIndex: number;
	selectedCategory: string;
	selectedTab: TabNames;
}> = ({ results, selectedIndex, selectedCategory, selectedTab }) => {
	const [columns] = useDimensions();
	const [maxUrlLength, setMaxUrlLength] = useState<number>(
		calculateMaxUrlLength(columns)
	);

	useEffect(() => {
		setMaxUrlLength(calculateMaxUrlLength(columns));
	}, [columns]);

	return (
		<Box
			borderStyle='round'
			borderColor='cyan'
			padding={1}
			flexDirection='column'
		>
			<Box flexDirection='row'>
				<Text>
					{''.padStart(2, ' ')}
					<Text underline={selectedCategory === 'path'}>URL</Text>
				</Text>
				<Spacer />
				<MetricTitles
					selectedCategory={selectedCategory}
					selectedTab={selectedTab}
				/>
				{selectedTab === 'Page Sizes' ? null : (
					<Text dimColor>{'PRESET'.padStart(presetColumnWidth, ' ')}</Text>
				)}
			</Box>
			<Text> </Text>
			{results.map((result, index) => {
				const selected = index === selectedIndex;
				return (
					<Box key={result.name} flexDirection='row'>
						<Text>
							{selected ? `${figures.arrowRight} ` : '  '}
							<Text underline={selected}>
								{truncateUrl(result.url, maxUrlLength)}
							</Text>
						</Text>
						<Spacer />
						{selectedTab === 'Page Sizes' ? (
							<Text>{result.sizeDisplay}</Text>
						) : (
							<>
								<LighthouseScores scores={result.scores} />
								<Text dimColor>
									{(result.mobile ? 'mobile' : 'desktop').padStart(
										presetColumnWidth,
										' '
									)}
								</Text>
							</>
						)}
					</Box>
				);
			})}
		</Box>
	);
};
