import Modal, { Props } from "react-modal";
import "./CreateNodeModal.css";
import { useState } from "react";

interface CustomProps extends Props {
	onCreateNode: (name: string, heuristic: number) => void;
}

export default function CreateNodeModal(props: CustomProps) {
	const [name, setName] = useState(
		`Node #${Math.floor(Math.random() * 100000)}`
	);
	const [heuristic, setHeuristic] = useState(0);

	return (
		<Modal
			{...props}
			ariaHideApp={false}
			id={"CreateNodeModal"}
			style={{
				content: {
					width: 500,
					height: "fit-content",
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
					top: "50%",
					left: "50%",
					transform: `translate(-50%, -50%)`,
				},
				overlay: {
					zIndex: 1000,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				},
			}}
		>
			<input
				placeholder={"Node name (Optional)"}
				style={{ maxWidth: "100%" }}
				onChange={(e) => {
					setName(e.target.value);
				}}
			/>
			<input
				type={"number"}
				placeholder={"Heuristic"}
				style={{ maxWidth: "100%" }}
				onChange={(e) => {
					const num = Number.parseInt(e.target.value);
					if (isNaN(num)) {
						setHeuristic(0);
						return;
					}
					setHeuristic(num);
				}}
			/>
			<div className={"create-node-modal-button-container"}>
				<button onClick={props.onRequestClose}>Cancel</button>
				<button
					onClick={() => {
						props.onCreateNode(name, heuristic);
						setName(`Node #${Math.floor(Math.random() * 100000)}`);
						// @ts-ignore
						props.onRequestClose();
					}}
				>
					Create
				</button>
			</div>
		</Modal>
	);
}
