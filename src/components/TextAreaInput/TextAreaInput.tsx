import React, { useEffect, useState } from "react";

const TextareaInput = ({ spaces = 4 }) => {
	const [text, setText] = useState<{
		value: string;
		caret: number;
		target: any;
	}>({ value: "", caret: -1, target: null });

	useEffect(() => {
		if (text.caret >= 0) {
			text.target.setSelectionRange(
				text.caret + spaces,
				text.caret + spaces
			);
		}
	}, [text]);

	const handleTab = (e: any) => {
		let content = e.target.value;
		let caret = e.target.selectionStart;

		if (e.key === "Tab") {
			e.preventDefault();

			let newText =
				content.substring(0, caret) +
				" ".repeat(spaces) +
				content.substring(caret);

			setText({ value: newText, caret: caret, target: e.target });
		}
	};

	const handleText = (e: any) =>
		setText({ value: e.target.value, caret: -1, target: e.target });

	return (
		<textarea
			onChange={handleText}
			onKeyDown={handleTab}
			value={text.value}
		/>
	);
};

export default TextareaInput;
