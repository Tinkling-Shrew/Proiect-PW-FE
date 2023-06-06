import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import "./root.css";
import VisNetwork from "./components/VisNetwork/VisNetwork";
import Header from "./components/Header/Header";
import axios from "./api/api";
import { DataSetEdges, DataSetNodes, Edge, Node } from "vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { NetworkContext } from "./context/NetworkContext";
import GraphModel from "./models/GraphModel";
import CreateNodeModal from "./components/CreateNodeModal/CreateNodeModal";
import ImportModal from "./components/ImportModal/ImportModal";
import RunModal from "./components/RunModal/RunModal";
import { UserContext } from "./context/UserContext";
import UserModel from "./models/UserModel";
import UserModal from "./components/UserModal/UserModal";

export function exportNetwork(
	start: string,
	goal: string,
	nodes: DataSetNodes,
	edges: DataSetEdges,
	heuristics: { [key: string]: number }
) {
	const currentHeuristics: {} = {};
	const searchSpace: {} = {};

	nodes.forEach((item, id) => {
		// @ts-ignore
		currentHeuristics[item.label] = heuristics[item.label];
		// @ts-ignore
		searchSpace[item.label] = {};

		edges.forEach((edgeItem, edgeId) => {
			if (id === edgeItem.from) {
				// @ts-ignore
				searchSpace[item.label][nodes.get(edgeItem.to).label] =
					edgeItem.length;
			}
		});
	});

	return {
		start: start,
		goal: goal,
		search_space: searchSpace,
		heuristics: currentHeuristics,
	};
}

export function importGraph({
	start,
	goal,
	search_space,
	heuristics,
}: {
	start: string;
	goal: string;
	search_space: { [key: string]: { [key: string]: number } };
	heuristics: { [key: string]: number };
}) {
	let nodes = new DataSet<Node, "id">([]);
	let edges = new DataSet<Edge, "id">([]);

	Object.keys(search_space).forEach((key, index) => {
		nodes.add({ label: key, id: key });
		Object.keys(search_space[key]).forEach((edgeKey) => {
			console.log(key);
			console.log(edgeKey);

			edges.add({
				from: key,
				to: edgeKey,
				length: search_space[key][edgeKey],
				label: `${search_space[key][edgeKey]}`,
			});
		});
	});

	console.log({
		start: start,
		goal: goal,
		nodes: nodes,
		edges: edges,
		heuristics: heuristics,
	});

	return {
		start: start,
		goal: goal,
		nodes: nodes,
		edges: edges,
		heuristics: heuristics,
	};
}

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [user, setUser] = useState<UserModel | null>(null);

	const [createModal, setCreateModal] = useState<boolean>(false);
	const [importModal, setImportModal] = useState<boolean>(false);
	const [runModal, setRunModal] = useState<boolean>(false);
	const [loginModal, setLoginModal] = useState<boolean>(false);

	const [isRunning, setIsRunning] = useState(false);

	const [nodes, setNodes] = useState<DataSet<Node>>(
		new DataSet([
			{ id: 1, label: "A" },
			{ id: 2, label: "B" },
		])
	);
	const [edges, setEdges] = useState<DataSet<Edge>>(
		new DataSet([{ id: 12, from: 1, to: 2, length: 100, label: "100" }])
	);

	const [graph, setGraph] = useState<GraphModel>({} as GraphModel);
	const [start, setStart] = useState("A");
	const [goal, setGoal] = useState("B");

	const [heuristics, setHeuristics] = useState<{ [key: string]: number }>({
		A: 100,
		B: 100,
	});

	const [result, setResult] = useState();
	const [algorithm, setAlgorithm] = useState<string>("bfs");

	const onRun = () => {
		setIsRunning(true);
		setNodes(new DataSet([]));
		setEdges(new DataSet([]));
		setGraph(exportNetwork(start, goal, nodes, edges, heuristics));
		axios
			.post(
				"/execute/" + algorithm?.toLowerCase(),
				exportNetwork(start, goal, nodes, edges, heuristics)
			)
			.then((res) => {
				console.log(res.data);
				setResult(res.data);
				setRunModal(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onCreate = () => {
		setCreateModal(true);
	};

	const createNode = (name: string, heuristic: number) => {
		nodes.add({ id: Math.floor(Math.random() * 100000), label: name });
		setHeuristics((current) => {
			return { ...current, [name]: heuristic };
		});
	};

	const onClear = () => {
		nodes.clear();
		edges.clear();
	};

	const onUser = () => {
		setLoginModal(true);
	};

	const onImport = () => {
		setImportModal(true);
	};

	useEffect(() => {
		console.log("USER CONTEXT: ", user, isLoggedIn);
	}, [user, isLoggedIn]);

	return (
		<UserContext.Provider
			value={{
				isLoggedIn: isLoggedIn,
				setIsLoggedIn: (isLoggedIn) => setIsLoggedIn(isLoggedIn),
				user: user,
				setUser: (user) => setUser(user),
			}}
		>
			<NetworkContext.Provider
				value={{
					data: { nodes, edges },
					setData: (nodes, edges) => {
						setNodes(nodes);
						setEdges(edges);
					},
					graph: graph,
					setGraph: (graph) => setGraph(graph),
					heuristics: heuristics,
					setHeuristics: setHeuristics,
					start: start,
					setStart: (start) => setStart(start),
					goal: goal,
					setGoal: (goal) => setGoal(goal),
				}}
			>
				<div className="App">
					<Header
						start={start}
						goal={goal}
						onSelect={(alg) => {
							setAlgorithm(alg);
						}}
						onUser={onUser}
						onRun={onRun}
						onCreate={onCreate}
						onImport={onImport}
						onClear={onClear}
						setStart={(start) => setStart(start)}
						setGoal={(goal) => setGoal(goal)}
					/>
					<VisNetwork isRunning={isRunning} />
				</div>
				<CreateNodeModal
					isOpen={createModal}
					onCreateNode={createNode}
					onRequestClose={() => setCreateModal(false)}
				/>
				<ImportModal
					exportFunction={exportNetwork}
					importFunction={importGraph}
					isOpen={importModal}
					onRequestClose={() => setImportModal(false)}
				/>
				{result && (
					<RunModal
						isOpen={runModal}
						onRequestClose={() => {
							setRunModal(false);
							setIsRunning(false);
						}}
						result={result}
					/>
				)}
				<UserModal
					isOpen={loginModal}
					onRequestClose={() => {
						setLoginModal(false);
					}}
				/>
			</NetworkContext.Provider>
		</UserContext.Provider>
	);
}

export default App;
