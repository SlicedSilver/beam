/**
 * Simple async delay function
 * @param  {number} ms - Milliseconds to wait
 */
export const delay = async function (ms: number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
};
