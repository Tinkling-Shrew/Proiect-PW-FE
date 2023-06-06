export default function Storyboard() {
	return <div
		id="storyboard"
		style={{display: "none"}}
	>
		<h2>Story:</h2>
		<div id="storyboard-description"></div>
		<h5
			id="storyboard-list-name"
			className="mt-3"
		></h5>
		<div id="storyboard-list"></div>
		<div
			style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", flexGrow: 1}}
		>
			<button
				id="storyboard-button-prev"
				className="btn btn-danger"
				disabled
			>
				Previous
			</button>
			<button
				id="storyboard-button-next"
				className="btn btn-danger"
			>
				Next
			</button>
		</div>
	</div>
}