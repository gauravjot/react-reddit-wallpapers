import axios from "axios";
import _ from "lodash";
import React from "react";
import "./styles/compiled/app.css";

import WallpaperCard from "./components/WallpaperCard";
import { pageScrollLength } from "./Utils";

function App() {
	const wallpaperSubs = "wallpapers+wallpaper+widescreenwallpaper+WQHD_Wallpaper";
	const baseURL = "https://www.reddit.com/r/";

	const [currentSub, setCurrentSub] = React.useState(wallpaperSubs);
	const [page, setPage] = React.useState(1);
	const [after, setAfter] = React.useState();
	const currentSort = "hot";
	const [nsfwFilter, setNsfwFilter] = React.useState(false);
	const [showWidescreen, setShowWidescreen] = React.useState(false);
	const [show4k, setShow4k] = React.useState(false);

	const [data, setData] = React.useState([]);
	const [isErrorResponse, setIsErrorResponse] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);
	let settingsRef = React.useRef(null);

	React.useEffect(() => {
		setIsErrorResponse(false);
		setData([]);
		setIsLoading(true);
		axios
			.get(baseURL + currentSub + "/" + currentSort + ".json?count=" + page * 100)
			.then((response) => {
				setData(response.data.data.children);
				setAfter(response.data.data.after);
				setIsLoading(false);
			})
			.catch((err) => {
				setIsErrorResponse(true);
			});
	}, [currentSub]);

	React.useEffect(() => {
		function handleInfiniteScroll() {
			// Calculate how much scroll is needed to trigger based on number of pages
			let scrollRequired = 100 - 20 / page;
			scrollRequired = scrollRequired > 96 ? 96 : scrollRequired;
			if (!isLoading && data.length > 0 && pageScrollLength() > scrollRequired) {
				setIsLoading(true);
				const nextPageNum = page + 1;
				setPage(nextPageNum);
				axios
					.get(
						baseURL +
							currentSub +
							"/" +
							currentSort +
							".json?count=" +
							nextPageNum * 100 +
							"&after=" +
							after
					)
					.then((response) => {
						const ldata = [...data, ...response.data.data.children];
						setData(ldata);
						setAfter(response.data.data.after);
						setIsLoading(false);
					})
					.catch((err) => {
						setIsErrorResponse(true);
						setIsLoading(false);
					});
			}
		}
		window.addEventListener("scroll", handleInfiniteScroll);
		return () => {
			window.removeEventListener("scroll", handleInfiniteScroll);
		};
	});

	React.useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	function subChange(sub) {
		if (sub.length < 1) {
			setCurrentSub(wallpaperSubs);
			return;
		}
		if (sub.length < 3) {
			return;
		}
		setCurrentSub(sub);
	}

	const _subChange = _.debounce((sub) => subChange(sub), 600);

	function aspectClassSwitch(width, height) {
		let a_ratio = width / height;
		switch (true) {
			case a_ratio > 3.5:
				return "card grid-span-3";
			case a_ratio > 2.2:
				return "card grid-span-2";
			case a_ratio > 0.8:
				return "card";
			case a_ratio > 0.4:
				return "card grid-row-span-2";
			default:
				return "d-none";
		}
	}

	const toggleEventHandler = React.useCallback((e) => {
		/* useCallback so function doesnt change in re-renders
       otherwise our add/remove eventListeners will go haywire */
		/* whitelisted with if-else loop:
		   1. The menu box
		   2. The button which is toggle
		   3. Close-icon in Multiselect
		   add more for exceptions */
		if (
			!document.getElementById("settings-menu")?.contains(e.target) &&
			settingsRef.current &&
			!settingsRef.current.contains(e.target)
		) {
			toggleSettings();
		}
	}, []);

	/* Filter Toggle */
	const toggleSettings = () => {
		if (settingsRef.current) {
			let attribValue = settingsRef.current.getAttribute("aria-hidden");
			settingsRef.current.setAttribute(
				"aria-hidden",
				attribValue === "true" ? "false" : "true"
			);
			if (attribValue === "true" ? false : true) {
				window.removeEventListener("click", toggleEventHandler);
			} else {
				// Detect clicks outside of filter box
				window.addEventListener("click", toggleEventHandler);
			}
		}
	};

	let prevScrollpos = window.pageYOffset;
	window.onscroll = function () {
		let currentScrollPos = window.pageYOffset;
		if (currentScrollPos < 200 || prevScrollpos > currentScrollPos) {
			document.getElementById("nav-bar").style.top = "0";
		} else {
			settingsRef.current.setAttribute("aria-hidden", "true");
			window.removeEventListener("click", toggleEventHandler);
			document.getElementById("nav-bar").style.top = "-6rem";
		}
		prevScrollpos = currentScrollPos;
	};

	return (
		<section className="container">
			<div className="searchbar" id="nav-bar">
				<div className="container flex">
					<input
						type="text"
						name="subreddit"
						placeholder="start typing a subreddit..."
						onChange={(event) => _subChange(event.target.value.trim())}
					/>
					<div className="dropdown" id="settings-menu">
						<button
							className="btnSettings"
							onClick={() => {
								toggleSettings();
							}}
						>
							<span className="ic ic-settings invert-1"></span>
						</button>
						<div
							className="menu"
							id="options"
							aria-hidden="true"
							ref={settingsRef}
						>
							<button
								className="menu-item"
								onClick={() => {
									setNsfwFilter(!nsfwFilter);
								}}
							>
								<span
									className={
										(nsfwFilter ? "ic-checked" : "ic-unchecked") +
										" ic-md invert-1"
									}
								></span>
								<label>Enable NSFW</label>
							</button>
							<button
								className="menu-item"
								onClick={() => {
									setShowWidescreen(!showWidescreen);
								}}
							>
								<span
									className={
										(showWidescreen ? "ic-checked" : "ic-unchecked") +
										" ic-md invert-1"
									}
								></span>
								<label>Show only Widescreen</label>
							</button>
							<button
								className="menu-item"
								onClick={() => {
									setShow4k(!show4k);
								}}
							>
								<span
									className={
										(show4k ? "ic-checked" : "ic-unchecked") +
										" ic-md invert-1"
									}
								></span>
								<label>Show 4K or above</label>
							</button>
						</div>
					</div>
				</div>
			</div>
			{isLoading && (
				<div
					className={
						pageScrollLength() > 20
							? "stay-fixed-br"
							: "flex place-items-center justify-center min-h-screen w-full"
					}
				>
					<div className="lds-dual-ring"></div>
				</div>
			)}
			<div className="wallpapers">
				{data.length > 0 ? (
					data.map((item) =>
						item.data.preview ? (
							item.data.preview.enabled &&
							item.data.preview.images[0].resolutions[
								item.data.preview.images[0].resolutions.length - 1
							] ? (
								(show4k &&
									parseInt(item.data.preview.images[0].source.width) >=
										3840 &&
									parseInt(item.data.preview.images[0].source.height) >=
										2160) ||
								!show4k ? (
									(showWidescreen &&
										parseInt(
											item.data.preview.images[0].source.width
										) /
											parseInt(
												item.data.preview.images[0].source.height
											) >
											2.3) ||
									!showWidescreen ? (
										<div
											key={item.data.id}
											className={aspectClassSwitch(
												item.data.preview.images[0].source.width,
												item.data.preview.images[0].source.height
											)}
										>
											<WallpaperCard
												baseURL={baseURL}
												wallpaper={item.data}
												nsfwFilter={nsfwFilter}
											/>
										</div>
									) : (
										""
									)
								) : (
									""
								)
							) : (
								""
							)
						) : (
							""
						)
					)
				) : isErrorResponse ? (
					<div className="error">
						<i className="fas fa-exclamation-triangle"></i>
						<div>Network Error or Sub does not exist :/</div>
					</div>
				) : (
					<></>
				)}
			</div>
		</section>
	);
}

export default App;
