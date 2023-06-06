function edge_exists(input: any, from: any, to: any) {
	let test = false;
	input.forEach((obj: any) => {
		if (obj.from === from && obj.to === to) test = true;
	});
	return test;
}

export function convertAll(tree_data: any) {
	let output: any = { nodes: [], edges: [] };
	let temp_id = 1;

	for (let i = 0; i < tree_data.length; i++) {
		output["nodes"].push({
			id: tree_data[i].node,
			label: tree_data[i].node,
		});
		for (let j = i + 1; j < tree_data.length; j++) {
			if (
				tree_data[i].node === tree_data[j].parent &&
				!edge_exists(
					output["edges"],
					tree_data[j].node,
					tree_data[i].node
				)
			) {
				output["edges"].push({
					id: temp_id,
					from: tree_data[i].node,
					to: tree_data[j].node,
					length: 50,
				});
				temp_id++;
			}
		}
	}

	return output;
}
