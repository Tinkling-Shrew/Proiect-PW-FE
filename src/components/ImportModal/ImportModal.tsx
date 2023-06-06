import Modal, { Props } from "react-modal";
import "./ImportModal.css";
import { useContext, useEffect, useState } from "react";
import { NetworkContext } from "../../context/NetworkContext";
import { DataSetEdges, DataSetNodes } from "vis-network";
import { exportNetwork, importGraph } from "../../App";
import { UserContext } from "../../context/UserContext";
import axios from "../../api/api";

function isJsonString(str: string) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

interface CustomProps extends Props {
	exportFunction: (
		start: string,
		goal: string,
		nodes: DataSetNodes,
		edges: DataSetEdges,
		heuristics: { [key: string]: number }
	) => {
		start: string;
		goal: string;
		search_space: {};
		heuristics: {};
	};

	importFunction: ({
		start,
		goal,
		search_space,
		heuristics,
	}: {
		start: string;
		goal: string;
		search_space: { [key: string]: { [key: string]: number } };
		heuristics: { [key: string]: number };
	}) => {
		start: string;
		goal: string;
		nodes: DataSetNodes;
		edges: DataSetEdges;
		heuristics: { [key: string]: number };
	};
}

export default function ImportModal(props: CustomProps) {
	const {
		data,
		setData,
		goal,
		setGoal,
		start,
		setStart,
		heuristics,
		setHeuristics,
	} = useContext(NetworkContext);

	const { isLoggedIn, user } = useContext(UserContext);

	const [graph, setGraph] = useState<{
		start: string;
		goal: string;
		search_space: { [key: string]: { [key: string]: number } };
		heuristics: { [key: string]: number };
	}>(exportNetwork(start, goal, data.nodes, data.edges, heuristics));

	const [isError, setIsError] = useState(false);

	const submitGraph = () => {
		axios
			.post(`/graphs/${user?.id}`, {
				graph: {
					name: `graph_${user?.id}_${Math.floor(
						Math.random() * 100
					)}`,
					data: graph,
				},
				user: user?.id,
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	return (
		<Modal
			{...props}
			ariaHideApp={false}
			id={"CreateNodeModal"}
			style={{
				content: {
					width: 500,
					height: "75vh",
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
			<h5>Import / export graph</h5>
			<textarea
				id={"import-textarea"}
				className={"import-textarea"}
				placeholder={"Graph"}
				defaultValue={`${JSON.stringify(graph, undefined, 4)}`}
				onChange={(e) => {
					if (isJsonString(e.target.value)) {
						setIsError(false);
						console.log(JSON.parse(e.target.value));
						setGraph(JSON.parse(e.target.value));
						return;
					}
					setIsError(true);
				}}
				style={
					isError
						? {
								borderColor: "none",
								outlineStyle: "solid",
								outlineColor: "red",
								outlineWidth: 2,
						  }
						: {}
				}
			/>
			<div className={"create-node-modal-button-container"}>
				<button onClick={props.onRequestClose}>Cancel</button>
				{isLoggedIn && (
					<button
						onClick={(e) => {
							submitGraph();
						}}
					>
						Save graph
					</button>
				)}
				<button
					onClick={() => {
						const importedGraph = importGraph(graph);

						setStart(importedGraph.start);
						setGoal(importedGraph.goal);
						setData(importedGraph.nodes, importedGraph.edges);
						setHeuristics(importedGraph.heuristics);

						// @ts-ignore
						props.onRequestClose?.();
					}}
				>
					Import
				</button>
			</div>
		</Modal>
	);
}
