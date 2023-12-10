window.route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const loaders = [
	{ path: "/", function: loadDashboard },
	{ path: "/settings", function: loadSettings },
	{ path: "/pong/tournament", function: loadTournamentCreation },
	{ path: "/pong/tournament/*", function: () => console.log("Called the wildercald funciton") },
]

const load = (path) => {
	const match = loaders.find(l => {
		if (l.path.includes("*")) {
			const basePath = l.path.replace("*", "");
			return path.startsWith(basePath);
		} else {
			return l.path === path;
		}
	});
	if (match)
		match.function();
}

const parser = new DOMParser();
const handleLocation = async () => {
	const path = window.location.pathname;
	try {
		const response = await fetch(path);
		if (!response.ok) {
			window.history.pushState(null, null, "/");
			handleLocation();
			//throw new Error(`Failed to fetch route. Status: ${response.status}`);
		}
		const html = await response.text();
		if (document.body) {
			const doc = parser.parseFromString(html, 'text/html');
			const bodyContent = doc.body.innerHTML;
			document.body.innerHTML = bodyContent;
		}
		load(path);
	} catch (error) {
		console.log(error);
		//Maybe we should send something to front end here!!!
	}
};

window.onpopstate = handleLocation;
handleLocation();

window.handleLocation = handleLocation;
