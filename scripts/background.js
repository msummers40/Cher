localStorage["nofollow"] = localStorage["nofollow"]||"false";

Object.defineProperty(String.prototype, "bool", {
    get : function() {
        return (/^(true|1)$/i).test(this);
    }
});

function getTF(name){
	return localStorage.getItem(name) == "true" ? true : false;
}

function setTF(name,value){
	localStorage.setItem(name, value );
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	//console.log("@bg onMessage",request);
    //console.log("@bg" , sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	
	// call content
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		//console.log("@bg chrome.tabs.query tabs:",tabs);
		//console.log(tabs[0].url);
		//console.log(tabs[0].url.protocol);
		//console.log(location.protocol);
		
		
		if ( tabs[0].url.substring(0, 7) != "chrome:" ) {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{mex: request.mex},
				function(response) {
					//console.log("@bg chrome.tabs.sendMessage >> ",response)
					if ( response != undefined ) {
						sendResponse(response);
					} else {
						sendResponse({cnt: 0 });
						//console.log("@bg - no data for this page");
					}
				}
			);
		} else {
			sendResponse({cnt: -1 });
		}

	});
	return true;
});

function updateBadge(tab) {
	chrome.tabs.sendMessage(tab.id, {mex: {action:"pageInfo"}} , function(response) {
		var mex;
		if ( response != undefined ) {
			if ( response.warnings == 0 ) {
				mex = "ok";
				chrome.browserAction.setBadgeBackgroundColor({color:"#0a0" , tabId:tab.id });
			} else {
				mex = response.warnings.toString();
				chrome.browserAction.setBadgeBackgroundColor({color:"#f40" , tabId:tab.id });
			}
		} else {
			mex = "-";
			chrome.browserAction.setBadgeBackgroundColor({color:"#aaa" , tabId:tab.id });
		}					  

		chrome.browserAction.setBadgeText({ text : mex , tabId:tab.id  })					
		
	});
}

// tab updated
chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tab) {
		//console.log("onUpdated",changeInfo);
		if ( changeInfo.status == "complete" ) {
			chrome.browserAction.setBadgeText({ text : "" , tabId:tab.id  })
			updateBadge(tab);
			chrome.tabs.sendMessage(tab.id, {mex: {action:"nofollow" , value: localStorage["nofollow"].bool }} , function(response) {});
			//chrome.tabs.insertCSS("body{background-color:red}");
		} else {
			chrome.browserAction.setBadgeText({ text : "" , tabId:tab.id  })
		}
	}
);

// tab activated
chrome.tabs.onActivated.addListener(
	function(activeInfo){
		chrome.tabs.get(activeInfo.tabId,
			function(tab){
				//console.log("onActivated",tab);
				chrome.browserAction.setBadgeText({ text : "" , tabId:tab.id  })
				updateBadge(tab);
			}
		);
	}
);

// from popup to backgroundpage
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == 'nofollow') {
		//console.log("nofollow",request);
		// now call the content
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			//console.log("sending message to content");
			chrome.tabs.sendMessage(tabs[0].id, {mex: request}, function(response) {
				//console.log("message to content sent");
			});
		});
        sendResponse({result: 'done'});
    }
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-58832-15']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();