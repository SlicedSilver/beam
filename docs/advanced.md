# Advanced

## Specifying paths

Beam searches your build folder to find the generated pages for your SSG website. The default behaviour is identify any file ending with the `.html` extension as a generated page. This behaviour can modified through the use of the `include`, `exclude`, and `alwaysInclude` options specified in a configuration file.

These options expect an array of strings, where the string can either be a relative path (from within the build folder) to a specific file or a Glob pattern. A Glob pattern is a string which can specify sets of filenames with wildcard characters.

> The following resources may be useful for learning Glob patterns:
> [A begineers guide to Glob Patterns](https://www.malikbrowne.com/blog/a-beginners-guide-glob-patterns) > [Glob tester - tool for testing glob patterns](https://globster.xyz)

The default value for `include` is `["**/*.html"]` which will search all the files and folders to find any file ending with `.html`.

Beam will apply the Glob patterns in the following order of precedence: `alwaysInclude`, `exclude`, `include`.

### Examples

#### Exclude a specific file

To exclude a specific file we can just add the file path to the `exclude` option.

Example snippet of configuration file:

```json
"include": ["**/*.html"],
"exclude": ["exclude-me.html", "folder/exclude-me-as-well.html"],
```

#### Exclude a specific path

To exclude a specific folder we can just add the folder path to the `exclude` option.

Example snippet of configuration file:

```json
"include": ["**/*.html"],
"exclude": ["private-folder"],
```

#### Exclude a specific path, but keep one of those files

The `alwaysInclude` option will take precedence over any `exclude` patterns so we can use the `exclude` option to exclude an entire directory, and then include a specific file with the `alwaysInclude` option.

Example snippet of configuration file:

```json
"include": ["**/*.html"],
"exclude": ["private-folder"],
"alwaysInclude": ["private-folder/keep-me.html"]
```

**Note:** This could also be achieved without using `alwaysInclude` by making use of a more complex `exclude` pattern such as `"private-folder/**/(!keep-me).html"`

## Specifying multiple presets

The `lighthouse` options property in the configuration file can either be specified as a single object, or as an array of objects. See [Configuration](configuration.md#lighthouse) for more detailed information on how to configure a preset, and the rules for using arrays for this property.

We can specify multiple lighthouse presets by using an array (as mentioned above). Each entry in the array will represent a seperate preset. The `targets` property of the entry specifies which urls the preset should be used for. The `targets` property expects an array of strings which are either url parths or Glob patterns (see above). Beam will go through the array in the order specified and try find the first `targets` pattern which matches the url for each test case. All entries in the array should have a `targets` property except for the last entry which will serve as a fallback preset and may not have a `targets` property defined.

### Example

Lets define a set of presets where we want the main index.html page to be tested with a different preset to the other pages.

Example snippet of configuration file:

```json
"lighthouse": [
    {
        "desktop": false,
        "mobile": false,
        "categories": ["performance", "accessibility"]
    },
    {
        "mobile": true,
        "categories": "all"
    }
]
```

## Media Features

Each `lighthouse` preset defined in the configuration file can control which Media features are set by the browser before running the test.

Notable examples are: Dark mode, Reduced Motion, High Contrast.

```json
"lighthouse": {
        "mediaFeatures": [
            {"name": "prefers-color-scheme", "value": "dark"},
            {"name": "prefers-reduced-motion", "value": "reduce"},
            {"name": "prefers-contrast", "value": "more"}
        ]
    }
```

## Page Flags

Page Flags are a way to set variables on the global `window` object of each page as it is loaded. The `pageWindowFlags` option expects an key/value object where the key is used as the variable name and the value is used as the value assigned.

### Example

If we wanted to set a global variable called `runningLighthouseTest` to the value of `true` we would use the following snippet within the configuration file:

```json
"lighthouse" : {
    "pageWindowFlags": {
        "runningLighthouseTest": true
    }
}
```
