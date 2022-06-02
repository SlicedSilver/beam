import type { PartialDeep } from 'type-fest';
import { Options } from '../options/types';

export type ConfigurationOptions = PartialDeep<Options>;

/* eslint-disable @typescript-eslint/naming-convention */

/** JSON Schema for the Configuration File,
 * `required`'s should be empty because it represents a 'partial'.
 * Can generate a similar schema using: `npm run generate-schema`
 */
export const configurationJSONSchema = {
	$ref: '#/definitions/Options',
	$schema: 'http://json-schema.org/draft-07/schema#',
	definitions: {
		JsonArray: {
			description: 'Matches a JSON array.',
			items: {
				$ref: '#/definitions/JsonValue',
			},
			type: 'array',
		},
		JsonObject: {
			additionalProperties: {
				$ref: '#/definitions/JsonValue',
			},
			description:
				"Matches a JSON object.\n\nThis type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.",
			type: 'object',
		},
		JsonPrimitive: {
			description: 'Matches any valid JSON primitive value.',
			type: ['string', 'number', 'boolean', 'null'],
		},
		JsonValue: {
			anyOf: [
				{
					$ref: '#/definitions/JsonPrimitive',
				},
				{
					$ref: '#/definitions/JsonObject',
				},
				{
					$ref: '#/definitions/JsonArray',
				},
			],
			description: 'Matches any valid JSON value.',
		},
		LighthouseCategories: {
			enum: ['performance', 'seo', 'best-practices', 'pwa', 'accessibility'],
			type: 'string',
		},
		LighthouseOptions: {
			additionalProperties: true,
			description: 'Options for Lighthouse',
			properties: {
				categories: {
					anyOf: [
						{
							items: {
								$ref: '#/definitions/LighthouseCategories',
							},
							type: 'array',
						},
						{
							const: 'all',
							type: 'string',
						},
					],
					description: 'List of Lighthouse categories to include in the tests',
				},
				desktop: {
					description: 'Run Lighthose tests in desktop mode',
					type: 'boolean',
				},
				mediaFeatures: {
					description: 'Page Media Features to Emulate.',
					items: {
						$ref: '#/definitions/MediaFeature',
					},
					type: 'array',
				},
				mobile: {
					description: 'Run Lighthouse tests in mobile mode',
					type: 'boolean',
				},
				pageWindowFlags: {
					$ref: '#/definitions/JsonObject',
					description: "Variables to set on the page's global window",
				},
				targets: {
					items: {
						type: 'string',
					},
					type: 'array',
				},
			},
			required: [],
			type: 'object',
		},
		MediaFeature: {
			additionalProperties: false,
			properties: {
				name: {
					type: 'string',
				},
				value: {
					type: 'string',
				},
			},
			required: [],
			type: 'object',
		},
		Options: {
			additionalProperties: false,
			properties: {
				alwaysInclude: {
					description: 'Local files within the dist folder to always include.',
					items: {
						type: 'string',
					},
					type: 'array',
				},
				dist: {
					description: 'Local folder containing the static files',
					type: 'string',
				},
				exclude: {
					description:
						'Local files within the dist folder to exclude from serving.',
					items: {
						type: 'string',
					},
					type: 'array',
				},
				include: {
					description:
						'Local files within the dist folder to serve as urls. Expects glob-patterns',
					items: {
						type: 'string',
					},
					type: 'array',
				},
				lighthouse: {
					anyOf: [
						{
							$ref: '#/definitions/LighthouseOptions',
						},
						{
							items: {
								$ref: '#/definitions/LighthouseOptions',
							},
							type: 'array',
						},
					],
					description: 'Lighthouse Options',
				},
				output: {
					additionalProperties: false,
					description: 'Output options',
					properties: {
						folder: {
							description: 'Folder to store generated results.',
							type: 'string',
						},
						html: {
							description: 'Save HTML reports',
							type: 'boolean',
						},
						json: {
							description: 'Save JSON reports',
							type: 'boolean',
						},
					},
					required: [],
					type: 'object',
				},
				server: {
					additionalProperties: false,
					description: 'Server options',
					properties: {
						brotliCompressionLevel: {
							description: 'Level of Brotli compression [1-11]',
							maximum: 11,
							minimum: 1,
							type: 'number',
						},
						port: {
							description: 'Port number to use for local server',
							maximum: 49_151,
							minimum: 0,
							type: 'number',
						},
					},
					required: [],
					type: 'object',
				},
				static: {
					description: 'Statically generated site',
					type: 'boolean',
				},
				urls: {
					description:
						'URLS to test, takes precedence over `include` and `exclude`',
					items: {
						type: 'string',
					},
					type: 'array',
				},
			},
			required: [],
			type: 'object',
		},
	},
};

/* eslint-enable @typescript-eslint/naming-convention */
