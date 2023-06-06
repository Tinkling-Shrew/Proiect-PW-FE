import "./Header.css";
import { FaUser } from "react-icons/fa";

export default function Header({
	start,
	goal,
	onSelect,
	onUser,
	onRun,
	onCreate,
	onImport,
	onClear,
	setStart,
	setGoal,
}: {
	start: string;
	goal: string;
	onSelect: (selected: string) => void;
	onRun: () => void;
	onUser: () => void;
	onCreate: () => void;
	onImport: () => void;
	onClear: () => void;
	setStart: (start: string) => void;
	setGoal: (goal: string) => void;
}) {
	return (
		<div className={"Header"}>
			<div className={"header-horizontal left"}>
				<h1 className={"logo"}>GraphVis</h1>
				<input
					placeholder={"Start"}
					defaultValue={start}
					onChange={(e) => {
						setStart(e.target.value);
					}}
				/>
				<input
					placeholder={"Goal"}
					defaultValue={goal}
					onChange={(e) => {
						setGoal(e.target.value);
					}}
				/>
				<button onClick={onCreate}>Add node</button>
				<button onClick={onClear}>Clear</button>
			</div>

			<div className={"header-horizontal right"}>
				<button
					className={"user-button"}
					onClick={() => {
						onUser();
					}}
				>
					<FaUser size={"70%"} />
				</button>
			</div>
			<div className={"header-horizontal right"}>
				Algorithm:
				<select
					onChange={(event) => {
						onSelect(event.target.value.toLowerCase());
					}}
				>
					<option>BFS</option>
					<option>DFS</option>
					<option>AStar</option>
					<option>GreedyBFS</option>
				</select>
				<button onClick={onRun}>Run</button>
				<button onClick={onImport}>Import</button>
			</div>
		</div>
	);
}
