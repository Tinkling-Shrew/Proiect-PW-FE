import { Network } from "vis-network/peer/esm/vis-network";

import { useContext, useEffect, useRef } from "react";
import "./VisNetwork.css";
import { NetworkContext } from "../../context/NetworkContext";

export default function VisNetwork({ isRunning }: { isRunning: boolean }) {
	const { data, graph, setGraph, heuristics, setHeuristics, start, goal } =
		useContext(NetworkContext);

	data.nodes.on("remove", (event, info) => {
		let deleted_ids = info?.items;

		let edges = data.edges.getIds({
			filter: function (item) {
				return (
					deleted_ids?.indexOf(item.to!) !== -1 ||
					deleted_ids.indexOf(item.from!) !== -1
				);
			},
		});

		data.edges.remove(edges);
	});

	const visJsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const options = {
			autoResize: true,

			height: `${window.innerHeight}`,
			width: `${window.innerWidth}`,

			interaction: { multiselect: true },
			edges: {
				smooth: {
					enabled: false,
				},
			},

			physics: {
				enabled: true,
				barnesHut: {
					theta: 0.5,
					gravitationalConstant: -2000,
					centralGravity: 0.3,
					springLength: 95,
					springConstant: 0.04,
					damping: 0.09,
					avoidOverlap: 1,
				},
			},
		};

		// @ts-ignore
		const network =
			// @ts-ignore
			visJsRef.current && new Network(visJsRef.current, data, options);

		if (network) {
			if (isRunning) {
				const seed = network.getSeed();
				// @ts-ignore
				network.setOptions({
					...options,
					layout: {
						randomSeed: seed,
						hierarchical: {
							enabled: true,
							direction: "DU",
							parentCentralization: false,
							edgeMinimization: false,
						},
					},
				});
			}

			network.on("doubleClick", (properties) => {
				let ids = properties.nodes;
				let clickedNodes = data.nodes.get(ids);

				console.log(network.getSelectedEdges());
				console.log(network.getSelectedNodes());

				console.log(heuristics);

				if (network.getSelectedEdges().length > 0) {
					data.edges.remove(network.getSelectedEdges());
				}

				if (network.getSelectedNodes().length > 0) {
					data.nodes.remove(network.getSelectedNodes());
				}

				window.getSelection()!.removeAllRanges();

				network.selectEdges([]);
				network.selectNodes([]);

				network.redraw();
			});

			network.on("click", (properties) => {
				let ids = properties.nodes;
				let clickedNodes = data.nodes.get(ids);

				console.log(network.getSelectedEdges());

				network.enableEditMode();

				if (clickedNodes.length === 2) {
					const len = Number.parseFloat(
						window.prompt("Length", "0") || "0"
					);
					if (len >= 0 && !isNaN(len)) {
						network.addEdgeMode();
						let updatedIds = data.edges.add([
							{
								from: clickedNodes[0].id,
								to: clickedNodes[1].id,
								length: len,
								label: `${len}`,
							},
						]);

						network.selectEdges([updatedIds[0]]);

						network.unselectAll();
					}
				}

				network.disableEditMode();
			});
			// setGraph(exportNetwork(network, start, goal, heuristics, false));
		}
	}, [visJsRef, data, isRunning]);

	return (
		<div ref={visJsRef} className={"vis-network-graph"} id={"vis-graph"} />
	);
}
