import { useContext, useEffect, useState } from "react";
import Modal, { Props } from "react-modal";
import { DataSetEdges, DataSetNodes } from "vis-network";
import { NetworkContext } from "../../context/NetworkContext";
import { convertAll } from "../../misc/convertAll";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { importGraph } from "../../App";
import graphModel from "../../models/GraphModel";

function getNetworkFromStep(step: any) {
	let { nodes, edges } = convertAll(step.tree);

	console.log(nodes, edges);

	let data_nodes = new DataSet([]);

	Object.keys(nodes).forEach((key) => {
		data_nodes.add(nodes[key]);
	});

	let data_edges = new DataSet([]);

	Object.keys(edges).forEach((key) => {
		data_edges.add(edges[key]);
	});

	return { nodes: data_nodes, edges: data_edges };
}

interface CustomProps extends Props {
	result: {
		algorithm: string;
		list_label: string;
		steps: {
			description: string;
			tree: { node: string; parent: string | null }[];
			list: {};
			highlights: string[];
		}[];
		steps_count: number;
	};
}

function RunModal(props: CustomProps) {
	const { setStart, setGoal, setData, setHeuristics, graph } =
		useContext(NetworkContext);

	const [step, setStep] = useState(0);
	const [result, setResult] = useState(props.result);

	const onNextStep = () => {
		console.log("RESULT: ", result);

		// @ts-ignore
		if (step < result.steps_count - 1) {
			// @ts-ignore
			setNetworkData(step + 1);
			setStep((old) => old + 1);
		}
	};

	const onPreviousStep = () => {
		console.log("RESULT: ", result);
		console.log("STEP: ", step);
		if (step > 0) {
			// @ts-ignore
			setNetworkData(step - 1);
			setStep((old) => old - 1);
		}
	};

	const highlightGraph = (nodes: DataSetNodes, step: number) => {
		nodes.forEach((node) => {
			// @ts-ignore
			if (result.steps[step].highlights.includes(node.label)) {
				node.color = {
					border: "#000000",
					background: "#00ff00",
					highlight: {
						border: "#2B7CE9",
						background: "#D2E5FF",
					},
				};
				nodes.update(node);
			}
		});
	};

	const setNetworkData = (currentStep: number) => {
		const { nodes, edges } = getNetworkFromStep(result.steps[step]);

		highlightGraph(nodes, currentStep);

		setStart(graph.start);
		setGoal(graph.goal);
		setData(nodes, edges);
		setHeuristics(graph.heuristics);
	};

	const onClose = () => {
		const oldGraph = importGraph(graph);

		setStart(oldGraph.start);
		setGoal(oldGraph.goal);
		setData(oldGraph.nodes, oldGraph.edges);
		setHeuristics(oldGraph.heuristics);

		setStep(0);

		// @ts-ignore
		props.onRequestClose();
	};

	useEffect(() => {
		console.log("Result: ", props.result);
	}, [props.result]);

	useEffect(() => {
		if (props.isOpen === true) {
			setStep(0);
			setNetworkData(0);
		}
	}, [props.isOpen]);

	return (
		<Modal
			{...props}
			ariaHideApp={false}
			id={"CreateNodeModal"}
			shouldCloseOnOverlayClick={false}
			style={{
				content: {
					width: 250,
					height: "fit-content",
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
					top: "30%",
					left: "25%",
					transform: `translate(-50%, -50%)`,
				},
				overlay: {
					background: "none",
					zIndex: 1000,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				},
			}}
		>
			<div>
				<h5>Step: {step + 1}</h5>
				{/*<h5>{props.result.algorithm}</h5>*/}
				<p>{result.steps[step].description}</p>
				{/*<p>List: {current.list}</p>*/}
				{/*<p>Tree: {current.tree}</p>*/}
			</div>
			<div className={"create-node-modal-button-container"}>
				<button
					onClick={() => {
						// @ts-ignore
						step === 0 ? onClose() : onPreviousStep();
					}}
				>
					{step === 0 ? "Cancel" : "Back"}
				</button>
				<button
					onClick={() => {
						// @ts-ignore
						step + 1 === result.steps_count
							? // @ts-ignore
							  onClose()
							: onNextStep();
					}}
				>
					{/*@ts-ignore*/}
					{step + 1 === result.steps_count ? "Finish" : "Next"}
				</button>
			</div>
		</Modal>
	);
}

export default RunModal;
