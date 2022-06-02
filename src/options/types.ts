import { JsonObject } from 'type-fest';

/** Options for the local server */
interface ServerOptions {
	/** Port number to use for local server
	 * @minimum 0
	 * @maximum 49151
	 */
	port: number;

	/** Level of Brotli compression [1-11]
	 * @minimum 1
	 * @maximum 11
	 */
	brotliCompressionLevel: number;
}

export type LighthouseCategories =
	| 'performance'
	| 'seo'
	| 'best-practices'
	| 'pwa'
	| 'accessibility';

export type MediaFeature = { name: string; value: string };

/** Options for Lighthouse */
export interface LighthouseOptions {
	/** URLS for which this config should apply */
	targets?: GlobPattern[];

	/** List of Lighthouse categories to include in the tests */
	categories: LighthouseCategories[] | 'all';

	/** Run Lighthouse tests in mobile mode */
	mobile: boolean;

	/** Run Lighthose tests in desktop mode */
	desktop: boolean;

	/** Page Media Features to Emulate. */
	mediaFeatures?: MediaFeature[];

	/** Variables to set on the page's global window */
	pageWindowFlags?: JsonObject;
}

/** Options for the generated results output */
interface OutputOptions {
	/** Folder to store generated results. */
	folder: string;

	/** Save HTML reports */
	html: boolean;

	/** Save JSON reports */
	json: boolean;
}

type GlobPattern = string;

export interface Options {
	/** Local folder containing the static files */
	dist: string;

	/** Local files within the dist folder to serve as urls. Expects glob-patterns */
	include: GlobPattern[];

	/** Local files within the dist folder to exclude from serving. */
	exclude?: GlobPattern[];

	/** Local files within the dist folder to always include.
	 * *(Not strictly required to achieve desired results
	 * but can simplify the pattern writing process.
	 * So included to make the users life a bit easier).*
	 */
	alwaysInclude?: GlobPattern[];

	/** URLS to test, takes precedence over `include` and `exclude` */
	urls?: string[];

	/** Statically generated site */
	static: boolean;

	/** Output options */
	output: OutputOptions;

	/** Server options */
	server: ServerOptions;

	/**
	 * **Lighthouse Options.**
	 *
	 * If an array:
	 * - then the last entry may not include the `targets` property
	 * - all other entries must include the 'targets' property.
	 * - Order matters: first config with a matching target will be used.
	 */
	lighthouse: LighthouseOptions | LighthouseOptions[];
}
