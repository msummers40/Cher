var $ = document.querySelector.bind(document);						// single
var $$ = document.querySelectorAll.bind(document);					// array
var fromId = document.getElementById.bind(document);				// single
var fromClass = document.getElementsByClassName.bind(document);		// array
var fromTag = document.getElementsByTagName.bind(document);			// array

String.prototype.bool = function() {
    return (/^true$/i).test(this);
};

function html(id,text){
	fromId(id).innerHTML = text;
}

function favlnk(url,txt) {
	return "<img src='http://www.google.com/s2/favicons?domain=" + url + "' class='inlineFavicon'> <a href='" + url + "' class='cont_link' target='_blank'><span>" + txt + "</span></a>";
}

function injectCSS(file){ /* obsolete */
	var link = document.createElement("link");
	link.href = chrome.extension.getURL(file);
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);				

}
