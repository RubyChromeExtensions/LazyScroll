// Create a parent item and two children.
//var parent = chrome.contextMenus.create({"title": "Lazy Scroll"});
var toggle_scroll_state = chrome.contextMenus.create(
  {"title": "Toggle Scroll State","onclick": toggle_state});
/*var child2 = chrome.contextMenus.create(
  {"title": "Reverse Direction", "parentId": parent, "onclick": reverse_direction});*/


function reverse_direction(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    lastTabId = tabs[0].id;
	});
	//console.log("Toggle State from context menu")
	sendMessageToContentScript("reverse-dir", lastTabId);
}

function toggle_state(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    lastTabId = tabs[0].id;
	});
	console.log("Toggle State from context menu")
	sendMessageToContentScript("toggle-state", lastTabId);
}

function sendMessageToExtension(command){
	chrome.runtime.sendMessage({command:command},function(){
		console.log("Sent command to extension : " + command);
	});

}

function sendMessageToContentScript(command, lastTabId){
	    //console.log("Message sent to script from background");
	    chrome.tabs.sendMessage(lastTabId, {command: command});
}

chrome.commands.onCommand.addListener(function(command) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    lastTabId = tabs[0].id;
	});
	console.log('Command:', command);
	if(command == "toggle-state"){
		console.log("Toggle state");
		//sendMessageToExtension(command);
		sendMessageToContentScript(command, lastTabId);
	}
	else if(command == "reverse-dir"){
		console.log("Reverse direction");
		//sendMessageToExtension(command);
		sendMessageToContentScript(command, lastTabId);
	}
	else if(command == "increase-speed"){
		console.log("Increase speed");
		//sendMessageToExtension(command);
		sendMessageToContentScript(command, lastTabId);
	}
	else{
		console.log("Decrease speed");
		//sendMessageToExtension(command);
		sendMessageToContentScript(command, lastTabId);
	}
});


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    console.log("Embed the content script");
    chrome.tabs.executeScript(lastTabId, { file: "jquery.js" }, function() {
	    chrome.tabs.executeScript(lastTabId, { file: "content_script.js" },function(){
	    	sendMessageToContentScript("Instantiated");
	    });
	});
});

var lastTabId;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log("Url updated");
    sendMessageToContentScript("stop-scroll", lastTabId);
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {     
	console.log("Tab created");    
   sendMessageToContentScript("stop-scroll", lastTabId);
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {     
	console.log("Active Changed");    
   sendMessageToContentScript("stop-scroll", lastTabId);
});


