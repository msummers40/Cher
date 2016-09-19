var bg = chrome.extension.getBackgroundPage(); 

function tools(url){

	console.log("@tools");
	
	//url = tab.url;
	url = url.replace("https://", "");
	url = url.replace("http://", "");
	url = url.split("?")[0];
	domain = url.split("/")[0];
	
	parts = domain.split(".");
	if ( parts.length > 2 ) parts = parts.slice(1);
	
	sdomain = parts.join(".");
	
	html("linksinfo","<b>The following links will analyze this URL: " + domain + "</b><br><span style='color:#ddd'>TIP: ctrl-click to open the links keeping this pop-up open.</span><br><br>");

	var ref = "?referer=http://goo.gl/ffGBYq";
	var refadd = "&referer=http://goo.gl/ffGBYq";
	
	// SEO
	var out = "";
	out += favlnk("http://www.alexa.com/siteinfo/"+domain+ref,"Alexa") + "<br/>";					// traffic
	out += favlnk("http://siteanalytics.compete.com/"+sdomain+ref,"Compete") + "<br/>";				// traffic keywords
	//out += favlnk("https://www.google.com/adplanner/site_profile#siteDetails?identifier="+domain,"Google Ad Planner") + "<br/>";	// info traffic keywords
	//out += favlnk("http://trends.google.com/websites?q="+domain,"Google Trends") + "<br/>";	// traffic
	//out += favlnk("http://www.majesticseo.com/search.php?q="+domain+refadd,"MajesticSEO") + "<br/>";	// backlinks
	out += favlnk("http://www.majesticseo.com/reports/site-explorer/summary/"+domain+ref,"MajesticSEO") + "<br/>";	// backlinks
	out += favlnk("http://www.quantcast.com/"+domain+ref,"Quantacast") + "<br/>";	// info
	out += favlnk("http://www.semrush.com/info/"+domain+ref,"SEMRush") + "<br/>";					// keyword
	out += favlnk("http://www.serpanalytics.com/sites/"+domain+ref,"SERPAnalytics") + "<br/>";		// traffic keywords
	//out += favlnk("http://serversiders.com/"+domain,"Serversiders") + "<br/>";				// info traffic
	out += favlnk("http://www.wmtips.com/tools/info/?url="+domain+refadd,"WMTIPS") + "<br/>";			// traffic info
	out += favlnk("http://www.wmtips.com/tools/keyword-density-analyzer/?url=http://"+domain+refadd,"Keyword Density Analyzer") + "<br/>";	// keywords
	html( "links1" , out );
	

	// Safety
	out = "";
	out += favlnk("http://www.google.com/safebrowsing/diagnostic?site="+domain+refadd,"Google Safe Browsing") + "<br/>";	// safety
	out += favlnk("http://www.siteadvisor.com/sites/"+domain+ref,"McAfee SiteAdvisor") + "<br/>";						// safety
	out += favlnk("http://www.mywot.com/en/scorecard/"+domain+ref,"WOT") + "<br/>";										// safety rating
	out += favlnk("http://safeweb.norton.com/report/show?url="+domain+refadd,"Norton Safe Web") + "<br/>";					// safety rating
	html( "links2" , out );


	// Social
	out = "";
	out += favlnk("http://www.google.com/webmasters/tools/richsnippets?url="+url+refadd,"Rich Snippets Testing Tool (G+)") + "<br/>";		// checker
	out += favlnk("https://plus.google.com/ripple/details?url="+url+refadd,"Ripples Explorer (G+)") + "<br/>";								// 
	out += favlnk("https://developers.facebook.com/tools/debug/og/object?q="+url+refadd,"Open Graph Object Debugger (FB)") + "<br/>";		// checker
	out += favlnk("http://developers.pinterest.com/rich_pins/validator/?link="+url+refadd,"Rich Pins validator (Pinterest)") + "<br/>";	// checker
	out += favlnk("http://backtweets.com/search?q="+domain+refadd,"BackTweets") + "<br/>";													// comunity
	
	
	
	html( "links4" , out );
	
	// Other
	out = "";
	
	out += favlnk("http://nibbler.silktide.com/reports/"+domain+ref,"Nibbler") + "<br/>";					// info
	out += favlnk("http://whois.domaintools.com/"+domain+ref,"DomainTools") + "<br/>";					// info
	out += favlnk("http://images.google.com/images?q=site:"+sdomain+refadd,"Google Images") + "<br/>";
	out += favlnk("http://www.intodns.com/"+sdomain+ref,"intoDNS") + "<br/>";
	out += favlnk("http://web.archive.org/web/*/"+url+ref,"WaybackMachine") + "<br/>";
	
	out += favlnk("http://www.wmtips.com/go/copyscape/http://"+url+ref,"Copyscape Plagiarism") + "<br/>";
	html( "links3" , out );
	
}

document.addEventListener('DOMContentLoaded', function(){
	
	// request on popup open
	chrome.runtime.sendMessage({mex: {action:"pageInfo"} }, function(response) {
	
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			//if ( tabs[0].url.substring(0, 7) != "chrome:" ) {
		
			//console.log("pageInfo",response);
		
			if ( response.cnt == -1 ) {
				html("out","There aren't tags on Chrome's special pages or Google's homepage, and maybe other pages that are kind of similar.");
			} else {
				if ( response.out != undefined ) {
					html("out",response.out);
				} else {
					html("out","There are no tags to share yet, because this page is loading, it's saved locally or maybe for another reason.<br><br>In any case there are no shared Open Graph or Twitter tags, as far as Cher can see.");
				}
			}

			jQuery("#menu>span").click(function(){
				if ( jQuery(this).attr("class") != "active" ) {
					jQuery("#menu span").removeClass("active");
					jQuery(this).addClass("active");
					jQuery(".panel").hide();
					var target = jQuery(this).data("target");
					
					localStorage.setItem("section", target );
					
					switch (target) {
						case "pagedata":
							jQuery("#out").show();
							break;				
					
/*						case "onlinetools":
							jQuery("#tools").show();
							break;
							
						case "options":
							jQuery("#options").show();
							break;							
*/
					}
					
				}
			});

			jQuery("[data-target=" + localStorage.getItem("section") + "]").click();
			
			jQuery("#showNofollow").click(function() {
				var checked = jQuery(this).prop('checked');
				//bg.console.log(checked);
				//localStorage.setItem("nofollow", checked );
				bg.setTF("nofollow",checked);
				// message to BG
				chrome.extension.sendRequest({action: 'nofollow' , value:checked}, function(response) {
				   //console.log(response.result);
				});
			}); 
			
			
			tools(tabs[0].url);
		
			//fromId("out").innerHTML = response.out;
			
			// "activate" links
			var links = document.getElementsByTagName("a");
			for (var i = 0; i < links.length; i++) {
				(function () {
					var ln = links[i];
					var location = ln.href;
					ln.onclick = function (e) {
						bg._gaq.push(['_trackEvent', 'onlinetool', this.innerText ]);
						e.preventDefault(); 
						var ctrl = e.ctrlKey || (e.which == 2);
						chrome.tabs.create({active: (!ctrl) , url: location});
						if ( !ctrl ) window.close();
					};
				})();
			}
			
			//console.log( localStorage.getItem("nofollow"));
			jQuery("#showNofollow").prop('checked', bg.getTF("nofollow") );
			
			bg._gaq.push(['_trackEvent', 'popup', 'open']);
		

		});
		
	});
	
});
