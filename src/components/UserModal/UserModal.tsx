import { useContext, useEffect, useState } from "react";
import Modal, { Props } from "react-modal";
import { importGraph } from "../../App";
import UserModel from "../../models/UserModel";
import "./UserModal.css";
import axios from "../../api/api";
import { UserContext } from "../../context/UserContext";
import GraphModel from "../../models/GraphModel";

interface CustomProps extends Props {}

function UserModal(props: CustomProps) {
	const { user, setUser, setIsLoggedIn, isLoggedIn } =
		useContext(UserContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [graphs, setGraphs] = useState<GraphModel[]>([]);

	const getUserGraphs = () => {
		axios
			.get(`/graphs/${user?.id}`)
			.then((res) => {
				console.log(res.data);
				setGraphs(res.data);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	const onSubmit = () => {
		return axios
			.get("/users/login", {
				params: { email: email, password: password },
			})
			.then((res) => {
				setUser(res.data[0]);
				setIsLoggedIn(true);
			})
			.catch((err) => {
				console.log(err.message);
			});
	};

	useEffect(() => {
		if (isLoggedIn) {
			getUserGraphs();
		}
	}, [user, isLoggedIn]);

	useEffect(() => {
		if (isLoggedIn && props.isOpen) {
			getUserGraphs();
		}
	}, [props.isOpen]);

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
			{isLoggedIn ? (
				<div>
					<p>User: {user?.email}</p>
					{graphs.map((graph) => {
						return (
							<button
								onClick={() =>
									navigator.clipboard.writeText(
										`${JSON.stringify(graph, null, 4)}`
									)
								}
							>
								Copy: {graph.start} - {graph.goal}
							</button>
						);
					})}
				</div>
			) : (
				<div className={"user-container"}>
					<h1>Login</h1>
					<input
						placeholder={"email"}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
					<input
						type={"password"}
						placeholder={"password"}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
				</div>
			)}
			<div className={"create-node-modal-button-container"}>
				<button
					onClick={(e) => {
						props.onRequestClose?.(e);
					}}
				>
					Cancel
				</button>
				<button
					onClick={(e) => {
						if (isLoggedIn) {
							props.onRequestClose?.(e);
							return;
						}
						onSubmit();
					}}
				>
					{isLoggedIn ? "Done" : "Login"}
				</button>
			</div>
		</Modal>
	);
}

export default UserModal;
