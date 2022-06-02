import fs from 'node:fs';
import path from 'node:path';

/**
 * Test whether a directory exists
 * @param  {string} dirPath - Path to Directory, shouldn't include file and extension
 */
export const ensureDirectoryExistence = (dirPath: string) => {
	if (fs.existsSync(dirPath)) {
		return true;
	}

	return false;
};

/**
 * Test whether a directory exists
 * @param  {string} filePath - Path to File, should include directory and extension
 */
export const ensureFileDirectoryExistence = (filePath: string) => {
	const dirname = path.dirname(filePath);
	return ensureDirectoryExistence(dirname);
};
