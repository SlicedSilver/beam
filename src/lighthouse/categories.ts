import { LighthouseCategories } from '../options/types.js';

export const lighthouseCategoriesArray: LighthouseCategories[] = [
	'performance',
	'accessibility',
	'best-practices',
	'seo',
	'pwa',
];

export const categoryTitles: Record<LighthouseCategories, string> = {
	performance: 'Performance',
	accessibility: 'Accessibility',
	'best-practices': 'Best Practices',
	seo: 'SEO',
	pwa: 'PWA',
};
