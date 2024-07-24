import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
	<React.StrictMode>
		<Router basename={"/react-reddit-wallpapers"}>
			<Routes>
				<Route path="/" element={<App />} />
			</Routes>
		</Router>
	</React.StrictMode>
);
