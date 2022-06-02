# Configuration

Listed below are the options available to use within a Beam configuration file.

> You can create a simple Beam configuration file by using the `beam --setup` command.

> You can specify which configuration file to use by using the config CLI flag. [See more about CLI Flags](cli-flags.md)

## dist

- Type: `string`
- Default: `dist`
- Example: `"dist": "builds/static",`

Specifies the relative path to the build directory for the current project.

## include

- Type: `array of strings`
- Default: `["**/*.html"]`
- Example: `"include": ["index.html", "posts/**/*.html"],`

Specifies which files within the `dist` folder should be included as urls for testing. The string values can be a Glob pattern (https://github.com/isaacs/minimatch#usage). See the [advanced docs](advanced.md) for more information.

## exclude

- Type: `array of strings`
- Example: `"exclude": ["404.html", "posts/[[:digit:]]/*.html"],`

Specifies which files within the `dist` folder should NOT be included as urls for testing. The string values can be a Glob pattern (https://github.com/isaacs/minimatch#usage).

## alwaysInclude

- Type: `array of strings`
- Example: `"alwaysInclude": ["posts/2/index.html"],`

Specifies which files within the `dist` folder should ALWAYS be included as urls for testing. The string values can be a Glob pattern (https://github.com/isaacs/minimatch#usage). This is a convenience property such that you can override any `exclude` rules, and thus don't need to write a more complex `exclude` rule.

## urls

- Type: `array of strings`
- Example: `"urls": ["index.html", "404.html", "posts/test"],`

Specifies the list of urls to be tested. Setting this property will result in Beam ignoring the `include`, `exclude`, and `alwaysInclude` properties, thus these will be the only urls tested.

## output

- Required properties: `folder`

Configuration options for the saving of Lighthouse reports to the local disk.

### folder

- Type: `string`
- Default: `.beam`
- Example: `"folder": "beam_reports",`

Specifies the relative path to the directory where Beam should save the generated Lighthouse audit reports.

### html

- Type: `boolean`
- Default: `true`
- Example: `"html": false,`

Specifies whether HTML Lighthouse audit reports should be saved.

### json

- Type: `boolean`
- Default: `false`
- Example: `"json": true,`

Specifies whether JSON Lighthouse audit reports should be saved.

## server

Specifies the options for the local web server which is created to serve the pages.

### port

- Type: `number`
- Default: `3000`
- Minimum: `0`
- Maximum: `49151`
- Example: `"port": 8080,`

Specifies the port number to use for the local web server.

### brotliCompressionLevel

- Type: `number`
- Default: `11`
- Minimum: `1`
- Maximum: `11`
- Example: `"brotliCompressionLevel": 11,`

Specifies the compress level to use for the Brotli compression (11 being the highest compression level).

## lighthouse

- Type: `object` / `array`

Configuration options for Lighthouse. The `lighthouse` property can either be a single object containing the properties described below, or an array of similar objects (if you would like to have different options for different urls). If an array is used then the following rules apply:

- All entries (except the last) must include the `targets` property
- The last entry may not include the `targets` property as it will be used as the fallback.
- Beam will determine which settings in the array to use for each url by going through the entries in order and using the first whose `targets` pattern matches the current url. If no matches are found then the last entry (the fallback) will be used.

### targets

- Type: `array of strings`
- Example: `"targets": ["index.html", "posts/**/*.html"],`

Only applicable if used within an array of settings (as described above).
The pattern to test whether the current entry in the array of settings should be used for a specific url.

### categories

- Type: `array` containing `"performance", "best-practices", "seo", "pwa", "accessibility"` / `string` = `all`
- Default: `'all'`
- Example: `"categories": ["performance", "best-practices"],`

Specifies the which Lighthouse audits to run.

### mobile

- Type: `boolean`
- Default: `true`
- Example: `"mobile": false,`

Specifies whether to run the Lighthouse audit using the 'mobile' preset. If both `mobile` and `desktop` are true then two seperate tests will be run for each url.

### desktop

- Type: `boolean`
- Default: `false`
- Example: `"desktop": true,`

Specifies whether to run the Lighthouse audit using the 'desktop' preset. If both `mobile` and `desktop` are true then two seperate tests will be run for each url.

### mediaFeatures

- Type: `array` of `{"name": string, "value": string}`
- Example: `"mediaFeatures": [{"name": "prefers-color-scheme", "value": "dark"}],`

Media features to be applied to the page before running the Lighthouse audit. See the [advanced docs](advanced.md) for more information.

### pageWindowFlags

- Type: `object`
- Example: `"pageWindowFlags": { "myGlobalVar": 123 },`

Variables to be set on the page's global window object before running the Lighthouse audit. The keys of the object will be used as variable names and the values as the assigned values. See the [advanced docs](advanced.md) for more information.

---

# Detailed Example

```json
{
	"dist": "dist",
	"include": ["**/*.html"],
	"exclude": [
		"posts/tags/*/*.html",
		"landings",
		"posts/[[:digit:]]/*.html",
		"posts/!(tags)/*.html"
	],
	"alwaysInclude": ["posts/1/*.html"],
	"lighthouse": [
		{
			"targets": ["index.html"],
			"desktop": true,
			"mobile": false,
			"mediaFeatures": [{ "name": "prefers-color-scheme", "value": "dark" }],
			"pageWindowFlags": { "helloworld": true },
			"categories": ["performance", "best-practices", "accessibility", "seo"]
		},
		{
			"mobile": true,
			"categories": ["performance", "best-practices"]
		}
	],
	"server": { "port": 8000, "brotliCompressionLevel": 8 },
	"output": { "html": true, "json": false, "folder": ".beam" }
}
```
