import fsPromises from 'node:fs/promises';
import fs from 'node:fs';

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Be sure to wrap in a Try-Catch block
 * @param  {string} filePath - Path to File, should include directory and extension
 */
export const loadJSONFile = async (filePath: string) => {
	if (fs.existsSync(filePath)) {
		const fileContent = await fsPromises.readFile(filePath, 'utf8');
		const result = JSON.parse(fileContent) as Record<string, unknown>;
		return result;
	}

	throw new Error('JSON File not found');
};

/**
 * Be sure to wrap in a Try-Catch block
 * @param  {string} filePath - Path to File, should include directory and extension
 * @param  {Record<string, any>} contents - Contents to be written as JSON file
 */
export const saveJSONFile = async (
	filePath: string,
	contents: Record<string, any>
) => {
	const content = JSON.stringify(contents);
	await fsPromises.writeFile(filePath, content, 'utf8');
};

/* eslint-enable @typescript-eslint/naming-convention */
