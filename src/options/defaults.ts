import type { Options } from './types.js';

/**
 * **Default Options.**
 * Will be merged with the user configuration to form the
 * options used.
 */
export const defaultOptions: Options = {
	dist: 'dist',
	include: ['**/*.html'],
	static: true,
	output: {
		folder: '.beam',
		html: true,
		json: false,
	},
	server: {
		port: 3000,
		brotliCompressionLevel: 11,
	},
	lighthouse: {
		categories: 'all',
		mobile: true,
		desktop: false,
	},
};
