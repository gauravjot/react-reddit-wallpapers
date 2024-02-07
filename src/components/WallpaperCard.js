import React from "react";

export default function WallpaperCard({ baseURL, wallpaper, nsfwFilter }) {
	return (
		<a
			className="wallpaper"
			href={wallpaper.url}
			target="_blank"
			rel="noopener noreferrer"
		>
			<img
				className={
					wallpaper.over_18 && !nsfwFilter ? "thumbnail nsfw" : "thumbnail"
				}
				src={wallpaper.preview.images[0].resolutions[
					wallpaper.preview.images[0].resolutions.length - 1
				].url.replaceAll("amp;", "")}
				loading="lazy"
				alt={wallpaper.title}
			/>
			<div className="description">
				<div className="title">{wallpaper.title}</div>
				<div>
					From <span>r/{wallpaper.subreddit}</span>
				</div>
			</div>
			<div className="resolution">
				{wallpaper.preview.images[0].source.width} x{" "}
				{wallpaper.preview.images[0].source.height}
			</div>
			{wallpaper.over_18 && <div className="nsfw-tag">NSFW</div>}
			{wallpaper.preview.images[0].source.width /
				wallpaper.preview.images[0].source.height >
			2.2 ? (
				<div className="aspect">Ultrawide</div>
			) : (
				""
			)}
		</a>
	);
}
