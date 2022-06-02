# Getting Started 🚀

## First Steps

### Installation

```sh
npm install --location=global beam-cli
```

### Initial Setup

Run the following command to launch a setup utility which will walk you through creating a configuration file to suit your needs.

```sh
beam --setup
```

### Run Beam

```sh
beam
```

## The basics of how Beam works

In a nutshell, Beam will:

- identify files within your build directory which represent pages,
- launch a local web server to host those files,
- run Lighthouse audit tests on those pages,
- save the reports to local disk (if configured),
- and display the results in an interactive GUI.

Beam attempts to use sensible default values so that very little user configuration is required to get up and running. If you find that you need to tweak the behaviour then please have a look at some of the guides below.

## Guides

- [CLI Flags](cli-flags.md)
- [Configuration File Options](configuration.md)
- [GUI Guide](gui-guide.md)
- [Advanced Configuration](advanced.md)
