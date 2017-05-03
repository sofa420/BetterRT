chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "interactive"){//"complete") {
			clearInterval(readyStateCheckInterval);

			// Inject the main script into the page.
			setTimeout(function(){
				var betterrt = document.createElement("script");
				betterrt.src = chrome.extension.getURL("bundle.js");
				document.body.appendChild(betterrt);
			}, 100)
			// ----------------------------------------------------------


		}
	}, 10);
});
