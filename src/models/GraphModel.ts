interface GraphModel {
	start: string
	goal: string,
	search_space: {
		[key: string]: {
			[key: string]: number
		} | {}
	},
	heuristics: {
		[key: string]: number
	} | {}
}

export default GraphModel;