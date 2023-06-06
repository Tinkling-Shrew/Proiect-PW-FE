import axios from "axios";

export default axios.create({
	baseURL: "http://localhost/myapp/public",
	withCredentials: false,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});
