import fs from 'node:fs';

/**
 * Test whether a file exists
 * @param  {string} filePath - Path to File, should include directory and extension
 */
export const ensureFileExistence = (filePath: string) => {
	if (fs.existsSync(filePath)) {
		return true;
	}

	return false;
};
