import type { Ow } from 'ow';
import owDefault from 'ow';
import { errorMessage, warningMessage } from '../console/print.js';

// @ts-expect-error Workaround fix for loading Ow with ESM imports
const ow: Ow = owDefault.default as Ow;

export type Flags = {
	config?: string;
	dist?: string;
	urls?: string;
	port?: number;
	setup?: boolean;
	gui?: boolean;
};

const validateConfig = (config: unknown) => {
	ow(
		config,
		ow.string
			.minLength(2)
			.message(
				'Option flag `config` should be string with a minimum length of 2.'
			)
	);
};

const validateDist = (dist: unknown) => {
	ow(
		dist,
		ow.string
			.minLength(2)
			.message(
				'Option flag `dist` should be string with a minimum length of 2.'
			)
	);
};

const validateUrls = (urls: unknown) => {
	ow(
		urls,
		ow.string
			.minLength(2)
			.message(
				'Option flag `urls` should be string with a minimum length of 2.'
			)
	);
};

const validatePort = (port: unknown) => {
	ow(
		port,
		ow.number
			.inRange(0, 49_151)
			.message('Options flag `port` should be a number between 0 and 49151.')
	);
};

const validateGui = (gui: unknown) => {
	if (typeof gui !== 'boolean')
		throw new Error('Options flag `gui` to be of type `boolean`');
};

const validateSetup = (setup: unknown) => {
	if (typeof setup !== 'boolean')
		throw new Error('Options flag `setup` to be of type `boolean`');
};

const validations: Record<keyof Flags, (_: unknown) => void> = {
	config: validateConfig,
	dist: validateDist,
	urls: validateUrls,
	port: validatePort,
	gui: validateGui,
	setup: validateSetup,
};

export const validateFlags = async function (input: string[], flags: Flags) {
	if (input.length > 0) {
		warningMessage(
			'Unexpected input provided, please only use the option flags listed via `beam --help`'
		);
	}

	try {
		const keys = Object.keys(validations) as Array<keyof Flags>;
		for (const name of keys) {
			if (flags[name] !== undefined) validations[name](flags[name]);
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			errorMessage(error.message);
			return false;
		}

		throw error;
	}

	return true;
};
