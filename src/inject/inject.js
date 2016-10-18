chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "interactive"){//"complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// Inject the main script into the page.
			var script = document.createElement("script");
			script.src = chrome.extension.getURL("src/inject/embed.js");
			document.body.appendChild(script);
			// ----------------------------------------------------------


		}
	}, 10);
});
