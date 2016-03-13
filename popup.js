function sendMessageToContentScript(command){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    lastTabId = tabs[0].id;
	    console.log("Message sent to script from extension");
	    chrome.tabs.sendMessage(lastTabId, {command: command});
	});
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log("Got command from background : " + message['command']);
	if(message['command'] == "toggle-state"){
		//console.log("Toggle state");
		sendMessageToContentScript(message['command']);
	}
	else if(message['command'] == "reverse-dir"){
		//console.log("Reverse direction");
		sendMessageToContentScript(message['command']);
	}
	else if(message['command'] == "increase-speed"){
		//console.log("Set speed to 1");
		sendMessageToContentScript(message['command']);
	}
	else{
		//console.log("Set speed to 2");
		sendMessageToContentScript(message['command']);
	}
});

/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    console.log("Embed the content script");
    chrome.tabs.executeScript(lastTabId, {file: "content_script.js"}, function() {
      // Note: we also sent a message above, upon loading the event page,
      // but the content script will not be loaded at that point, so we send
      // another here.
      sendMessageToContentScript("Instantiated");
    });
});*/

