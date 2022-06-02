import chalk from 'chalk';
import figures from 'figures';

export const printMessage = (
	message: string,
	options?: { prefix?: string; suffix?: string }
) => {
	console.log(`${options?.prefix ?? ''}${message}${options?.suffix ?? ''}`);
};

export const printLines = (messages: string[]) => {
	for (const message of messages) {
		console.log(message);
	}
};

export const warningMessage = (message: string) => {
	printMessage(message, {
		prefix: chalk.yellow(`${figures.warning} Warning: `),
	});
};

export const errorMessage = (message: string) => {
	printMessage(message, { prefix: chalk.red(`${figures.cross} Error: `) });
};

export const infoMessage = (message: string) => {
	printMessage(message, { prefix: chalk.blueBright(`${figures.info} `) });
};
