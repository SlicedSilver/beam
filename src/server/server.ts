import zlib from 'node:zlib';
import process from 'node:process';
import ora from 'ora';
import compress from 'koa-compress';
import portscanner from 'portscanner';
import { startDevServer } from '@web/dev-server';
import type { Options } from '../options/types.js';
import { warningMessage } from '../console/print.js';

export const initialiseServer = async (options: Options) => {
	const port = await portscanner.findAPortNotInUse(
		options.server.port,
		options.server.port + 20,
		'127.0.0.1'
	);
	if (port !== options.server.port) {
		warningMessage(
			`Port ${options.server.port} was already in use, using ${port} instead.`
		);
	}

	const spinner = ora({
		text: 'Starting Server',
		color: 'cyan',
	});
	spinner.start();
	const koaCompress = compress({
		filter(content_type) {
			return /(text|application)/i.test(content_type);
		},
		threshold: 1024,
		gzip: {},
		deflate: {},
		br: {
			params: {
				[zlib.constants.BROTLI_PARAM_QUALITY]:
					options.server.brotliCompressionLevel,
			},
		},
	});

	const server = await startDevServer({
		config: {
			rootDir: `${process.cwd()}/${options.dist}`,
			port,
			open: false,
			nodeResolve: false,
			middleware: [koaCompress],
			esbuildTarget: 'esnext', // Skip transforms
		},
		logStartMessage: false,
	});

	spinner.succeed('Server started');
	return {
		server,
		port,
	};
};
