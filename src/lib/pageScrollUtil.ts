export function pageScrollLength() {
    let winheight = window.innerHeight ||
					(document.documentElement || document.body).clientHeight;
    let docheight = () => {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
    };
    let scrollTop =
        window.pageYOffset ||
        (
            document.documentElement ||
            document.body.parentNode ||
            document.body
        ).scrollTop;
    let trackLength = docheight() - winheight;
    let pctScrolled = Math.floor((scrollTop / trackLength) * 100); // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    return pctScrolled > 97 ? 100 : pctScrolled;
}