import axios from "axios";
import _ from "lodash";
import React from "react";
import "./styles/app.tailwind.css";

import WallpaperCard from "./components/WallpaperCard";
import { pageScrollLength } from "./lib/pageScrollUtil";
import useLocalStorage from "./hooks/useLocalStorage";
import { Frown, TriangleAlert, X } from "lucide-react";


export type WallpaperType = {
	id: string;
	url: string;
	over_18: boolean;
	preview: {
		enabled: boolean;
		images: {
			resolutions: {
				url: string;
			}[];
			source: {
				width: number;
				height: number;
			}
		}[];
	};
	title: string;
	subreddit: string;
}

function App() {
	const wallpaperSubs = "wallpapers+wallpaper+widescreenwallpaper+WQHD_Wallpaper";
	const baseURL = "https://corsproxy.io/?https://www.reddit.com/r/";

	const [currentSub, setCurrentSub] = React.useState(wallpaperSubs);
	const [page, setPage] = React.useState(1);
	const [after, setAfter] = React.useState();
	const currentSort = "hot";
	const [nsfwFilter, setNsfwFilter] = useLocalStorage<boolean>('showNSFWfilter', false);
	const [showWidescreen, setShowWidescreen] = useLocalStorage<boolean>('showwidescreenfilter', false);
	const [show4k, setShow4k] = useLocalStorage<boolean>('show4kfilter', false);
	const wallpapersRef = React.useRef<HTMLDivElement>(null);
	const inputBarRef = React.useRef<HTMLInputElement>(null);

	const [data, setData] = React.useState<{
		data: WallpaperType
	}[]>([]);
	const [isErrorResponse, setIsErrorResponse] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

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

	function loadNextPage() {
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
				if (data.length === 0 && response.data.data.after === null) {
					setIsErrorResponse(true);
				}
			})
			.catch((err) => {
				setIsErrorResponse(true);
				setIsLoading(false);
			});
	}

	function checkIfNoWallpapers() {
		if (wallpapersRef.current && wallpapersRef.current?.childNodes.length < 10 && !isLoading && !isErrorResponse) {
			loadNextPage();
		}
	}

	React.useEffect(() => {
		function handleInfiniteScroll() {
			// Calculate how much scroll is needed to trigger based on number of pages
			let scrollRequired = 100 - 20 / page;
			scrollRequired = scrollRequired > 96 ? 96 : scrollRequired;
			if (!isLoading && data.length > 0 && pageScrollLength() > scrollRequired) {
				loadNextPage();
			}
		}
		window.addEventListener("scroll", handleInfiniteScroll);
		const wallpaperCheckTimeout = setTimeout(()=>{
			checkIfNoWallpapers();
		}, 100);
		return () => {
			window.removeEventListener("scroll", handleInfiniteScroll);
			clearTimeout(wallpaperCheckTimeout);
		};
	});

	React.useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	function subChange(sub: string) {
		if (sub.length < 1) {
			setCurrentSub(wallpaperSubs);
			return;
		}
		if (sub.length < 3) {
			return;
		}
		setCurrentSub(sub);
	}

	const _subChange = _.debounce((sub: string) => subChange(sub), 600);

	function aspectClassSwitch(width: number, height: number) {
		let a_ratio = width / height;
		switch (true) {
			case a_ratio > 3.5:
				return "card col-span-1 md:col-span-2 xl:col-span-3";
			case a_ratio > 2.2:
				return "card col-span-1 md:col-span-2";
			case a_ratio > 0.8:
				return "card col-span-1";
			case a_ratio > 0.4:
				return "card row-span-2";
			default:
				return "d-none";
		}
	}

	let prevScrollpos = window.pageYOffset;
	window.onscroll = function () {
		const element = document.getElementById("nav-bar");
		if (element !== null && window.innerWidth >= 1024) {
			let currentScrollPos = window.pageYOffset;
			if (currentScrollPos < 200 || prevScrollpos > currentScrollPos) {
				element.style.top = "0";
			} else {
				element.style.top = "-6rem";
			}
			prevScrollpos = currentScrollPos;
		}
	};

	return (
		<section className="container">
			<div className="searchbar" id="nav-bar">
				<div className="container flex flex-col lg:flex-row">
					<div className="flex-1 relative">
						<input
							type="text"
							name="subreddit"
							placeholder="start typing a subreddit..."
							onChange={(event) => _subChange(event.target.value.trim())}
							ref={inputBarRef}
						/>
						{inputBarRef.current && inputBarRef.current?.value.length > 0 && 
							<button
								className="absolute right-3 top-3 opacity-80 hover:opacity-100"
								onClick={() => {
									if (inputBarRef.current) {
										inputBarRef.current.value = "";
										_subChange("")
									}
								}}
							>
								<X className="w-5 h-5" />
							</button>
						}
					</div>
					<div className="flex flex-wrap lg:flex-nowrap place-items-center gap-4 pt-4 lg:pt-0">
						<div className="lg:ml-8 font-medium text-sm">
							Show&nbsp;only
						</div>
						<button
							className={"border border-white/50 px-2.5 place-items-center h-8 border-solid rounded-full text-xs inline-block flex gap-2 " + (showWidescreen ? "opacity-100" : "opacity-70")}
							onClick={() => {
								setShowWidescreen(!showWidescreen);
							}}
						>
							<span
								className={
									(showWidescreen ? "ic-checked" : "ic-unchecked") +
									" ic invert-1"
								}
							></span>
							<div className="whitespace-nowrap"> Widescreen</div>
						</button>
						<button
							className={"border border-white/50 px-2.5 place-items-center h-8 border-solid rounded-full text-xs inline-block flex gap-2 " + (show4k ? "opacity-100" : "opacity-70")}
							onClick={() => {
								setShow4k(!show4k);
							}}
						>
							<span
								className={
									(show4k ? "ic-checked" : "ic-unchecked") +
									" ic invert-1"
								}
							></span>
							<div className="whitespace-nowrap">4K or above</div>
						</button>
						<div className="lg:ml-8 font-medium text-sm">
							Enable
						</div>
						<button
							className={"border border-white/50 px-2.5 place-items-center h-8 border-solid rounded-full text-xs inline-block flex gap-2 " + (nsfwFilter ? "opacity-100" : "opacity-70")}
							onClick={() => {
								setNsfwFilter(!nsfwFilter);
							}}
						>
							<span
								className={
									(nsfwFilter ? "ic-checked" : "ic-unchecked") +
									" ic invert-1"
								}
							></span>
							<div className="whitespace-nowrap">NSFW</div>
						</button>
					</div>
				</div>
			</div>
			{isLoading && (
				<div
					className={
						pageScrollLength() > 20 || wallpapersRef.current?.hasChildNodes()
							? "stay-fixed-br"
							: "flex place-items-center justify-center min-h-screen w-full"
					}
				>
					<div className="lds-dual-ring"></div>
				</div>
			)}
			<div className="wallpapers grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" ref={wallpapersRef}>
				{data.length > 0 ? (
					data.map((item) =>
						item.data.preview ? (
							item.data.preview.enabled &&
							item.data.preview.images[0].resolutions[
								item.data.preview.images[0].resolutions.length - 1
							] ? (
								(show4k &&
									(item.data.preview.images[0].source.width) >=
										3840 &&
									(item.data.preview.images[0].source.height) >=
										2160) ||
								!show4k ? (
									(showWidescreen &&
										(
											item.data.preview.images[0].source.width
										) /
											(
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
					<div className="flex gap-4 items-center justify-center md:col-span-2 pt-32 xl:col-span-3">
						<TriangleAlert className="w-8 h-8" />
						<p className="text-2xl">Network Error or Sub does not exist :/</p>
					</div>
				) : (
					<></>
				)}
			</div>
		</section>
	);
}

export default App;
