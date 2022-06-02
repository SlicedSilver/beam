import { useState } from 'react';

type UseListIndexOptions = {
	loops?: boolean;
};

export function useListIndex<T>(
	list: T[],
	options?: UseListIndexOptions
): [number, () => void, () => void] {
	const { loops } = { loops: false, ...options };
	const [index, setIndex] = useState(0);

	const previous = () => {
		let newIndex = index - 1;
		if (newIndex < 0) newIndex = loops ? list.length - 1 : 0;
		setIndex(newIndex);
	};

	const next = () => {
		let newIndex = index + 1;
		if (newIndex >= list.length) newIndex = loops ? 0 : list.length - 1;
		setIndex(newIndex);
	};

	return [index, previous, next];
}

export function useListItem<T>(
	list: T[],
	fallback: T,
	options?: UseListIndexOptions
): [T, () => void, () => void] {
	const options_ = { loops: false, ...options };
	const [index, previous, next] = useListIndex(list, options_);

	return [list[index] ?? fallback, previous, next];
}
