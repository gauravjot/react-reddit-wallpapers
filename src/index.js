import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory({
	basename: process.env.PUBLIC_URL,
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<Router basename={"/redditwal"} history={history}>
			<Routes>
				<Route path="/" element={<App />} />
			</Routes>
		</Router>
	</React.StrictMode>
);
