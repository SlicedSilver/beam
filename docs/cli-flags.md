# CLI Flags

The following CLI flags can be appended to the end of the `beam` command to customise the behaviour of the tool.

**Note:** CLI Flags take precendence over any configuration options specified by a config file. For example: changing the dist folder path by using the `--dist` flag will take precedence over the value specified in the local user configuration file.

## Setup

- Flag: `--setup` / `-s`
- Example Usage: `beam --setup`

Runs the setup wizard to assist the user in creating a configuration file for the current project. Please note that the generated configuration file will override the existing beam configuration file (if present) within the current directory.

## Configuration File Path

- Flag: `--config` / `-c`
- Expects: The relative path to a beam configuration file
- Example Usage: `beam --config beam_config.json`

Specifies the relative path to a Beam configuration file. The settings specified within this configuration file will override any default options.

## Build Folder Path

- Flag: `--dist` / `-d`
- Expects: The relative path to the build folder for the SSG files.
- Example Usage: `beam --dist build`

Specifies the relative path to the build folder containing the statically generated files. This is the folder which Beam will crawl to find pages to test.

## URLs

- Flag: `--urls` / `-u`
- Expects: A comma seperated list of URLs to test
- Example Usage: `beam --urls index.html,about.html,posts/hello_world`

Specifies a list of urls to test. This list of urls will be the only urls tested. Beam will not crawl the build folder to find urls to test if this is specified.

## Port

- Flag: `--port` / `-p`
- Expects: A number between 0 and 49151
- Example Usage: `beam --port 3001`

Specifies which port to use for the local web server which will be created.

## View Last

- Flag: `--viewlast`
- Example Usage: `beam --viewlast`

Tells Beam to not run any Lighthouse audit tests but instead display the results from the last run.

## No GUI

- Flag: `--no-gui`
- Example Usage: `beam --no-gui`

Tells Beam to not use the interactive GUI for displaying the results and rather display the results using a simple table outputted to terminal.

## Help

- Flag: `--help`
- Example Usage: `beam --help`

Displays a list of the available CLI flags.

## Version

- Flag: `--version`
- Example Usage: `beam --version`

Displays the current version of the tool.

# Extra Examples

- `beam --no-gui --viewlast` -> View the results from the last run in a simple console table output.
