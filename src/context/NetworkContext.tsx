import { createContext, useState } from "react";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { DataSetEdges, DataSetNodes, Node, Edge } from "vis-network";
import GraphModel from "../models/GraphModel";

interface NetworkModel {
	data: {
		nodes: DataSet<Node>;
		edges: DataSet<Edge>;
	};
	setData: (nodes: DataSetNodes, edges: DataSetEdges) => void;
	graph: GraphModel;
	setGraph: (graph: GraphModel) => void;
	heuristics: { [key: string]: number };
	setHeuristics: (heuristics: {}) => void;
	start: string;
	setStart: (start: string) => void;
	goal: string;
	setGoal: (goal: string) => void;
}

export const NetworkContext = createContext<NetworkModel>({
	data: {
		nodes: new DataSet<Node>([]),
		edges: new DataSet<Edge>([]),
	},
	setData: (nodes: DataSetNodes, edges: DataSetEdges) => {},
	graph: {} as GraphModel,
	setGraph: (graph: GraphModel) => {},
	heuristics: {},
	setHeuristics: (heuristics: {}) => {},
	start: "",
	setStart: (start: string) => {},
	goal: "",
	setGoal: (goal: string) => {},
});
