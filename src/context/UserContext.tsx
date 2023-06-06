import { createContext } from "react";
import UserModel from "../models/UserModel";

export interface UserContextModel {
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
	user: UserModel | null;
	setUser: (user: UserModel) => void;
}

export const UserContext = createContext<UserContextModel>({
	isLoggedIn: false,
	setIsLoggedIn: (isLoggedIn: boolean) => {},
	user: null,
	setUser: (user: UserModel) => {},
});
