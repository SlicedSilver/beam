import React from 'react';
import { render } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

const Splash = () => (
	<Gradient name='morning'>
		<BigText text='Beam' font='tiny' />
	</Gradient>
);

export const renderSplash = () => {
	const { unmount } = render(<Splash />);
	unmount();
};
