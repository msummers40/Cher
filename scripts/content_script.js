var debug = false;

function updateNofollow(act) {
	var list = $$("a[rel~=nofollow]");
	
	if ( act == "show" ) {
		for(i = 0; i < list.length; i++) {
			list[i].classList.add("MSI_ext_nofollow");
		}
	} else {
		for(i = 0; i < list.length; i++) {
			list[i].classList.remove("MSI_ext_nofollow");
		}
	}
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		if ( request.mex.action == "nofollow" ) {
			updateNofollow( request.mex.value ? "show" : "hide" );
			sendResponse({
				farewell: "nofollow sent ok"
			});
		}
		
		if ( request.mex.action == "pageInfo" ) {

		var out = "";
		var tout;
		var dotName;
		var warnings = 0;

		
	//////////////
	// SAFETY

	//////////////
	// META TAGS

		var i;
	
		var keys = 0;
		var desclen = 0;
		var headtitle;
		var tout_common = "";
		var tout_opengraph = "";
		var tout_twitter = "";
		var tout_geo = "";
		var tout_verification = "";
		var tout_other = "";
	

		var list = $$("meta");
		
		if (debug) {
			console.log("META");
			console.log(list);
		}
		
		var og_title=0,og_type=0,og_url=0,og_image=0,og_description=0;
		
		for(i = 0; i < list.length; i++) {
		
			tout = "";
		
			var content,name,contentIndex,nameIndex;
			
			// content of name attribute
			dotName = list[i].getAttribute("name");
			
			// find name
			
			if ( list[i].attributes[0].nodeName == "content" )  {
				contentIndex = 0;
				nameIndex = 1;
			} else {
				contentIndex = 1;
				nameIndex = 0;
			}			

			if ( list[i].attributes[nameIndex] != undefined ) {
				name = list[i].attributes[nameIndex].nodeName;
			} else {
				name = "---";
			}
			
			content = list[i].getAttribute("content");
			if ( content != null ) {
				contentNull = false;
				content = content.replace(/</g,"&lt;").replace(/>/g,"&gt;");
			} else {
				contentNull = true;
				content = "";
			}
			
			if (debug) {
				console.dir(list[i]);
				console.log("content",content);
			}
			
			///////
			
			if ( dotName != null ) {
			
				dotName = dotName.toLowerCase();
			
                tout += "<div class='ad_seo_item'><span class='meta_name'>" + dotName + "</span> = " + content+ "</div>";
				
				/*
				if ( list[i].attributes[contentIndex] != undefined ) {
					if ( list[i].attributes[contentIndex].nodeName != "content" ) {
						tout += " <span style='color:red'>WARNING</span> wrong attribute: '" + list[i].attributes[contentIndex].nodeName + "' instead of 'content'";
						warnings ++;
					}
				}
				*/
				
				if ( contentNull ) {
					tout += "<span style='color:red'>WARNING</span> not defined";
					if ( list[i].getAttribute("value") != null ) tout += ", invalid 'value' attribute found";
					warnings ++;
				} else {
					if ( content == "" ) {
						tout += " <span style='color:red'>WARNING</span> empty";
						warnings ++;
					}
				}
				
				if ( dotName == "description" && !contentNull ) {
					desclen = content.length;
					if ( desclen > 0 ) tout += " <span class='item_count'>(" + desclen + " characters)</span>";
				}
				
				if ( dotName == "keywords" ) {
					if ( content.length != 0 ) {
						keys = content.split(',');
						tout += " <span class='item_count'>( " + keys.length + "&nbsp;items )</span>";
					} else {
						keys = -1;
						tout += " <span class='item_count'>(empty)</span>";
					}
				}
				
				if ( dotName == "geo.position" || dotName == "geo.placename" || dotName == "icbm" ) {
					tout += " <a href='https://maps.google.com/maps?q=" + content.replace(/;/g,",") + "' class='cont_link'><img src='http://www.google.com/s2/favicons?domain=maps.google.com'></a>";
				}
				
				tout += "</div>";
				
			} else if ( name == "property" ) {
			//FACEBOOK
				dotName = list[i].attributes[nameIndex].textContent.toLowerCase();
				tout += "<div class='ad_seo_item'><span class='meta_name'>" + dotName + "</span> = ";
                


				if ( content != "" ) {
					if ( content.substr(0,4) == "http" ) {
						if( content.match(/^.+\.(jpe?g|bmp|png|gif)$/i) ) tout += "<img src='" + content + "'>";
						tout += "<a href='" + content + "' target='_blank' class='cont_link'><span>";
						tout += content + "</span></a>";
					} else {
						tout += content;
					}
				} else {
					tout += "<span class='ad_seo_details'>(empty)</span>";
				}
				tout += "</div>";
				
			} 
			
			
			if ( dotName != null ) {
				//if (debug) console.log( "#############", dotName.substring(0,3) );
				
				if ( dotName.substring(0,3) == "og:" ) {
					tout_opengraph += tout;
					if ( dotName == "og:title" ) og_title=1;
					if ( dotName == "og:type" ) og_type=1;
					if ( dotName == "og:url" ) og_url=1;
					if ( dotName == "og:image" ) og_image=1;
					if ( dotName == "og:description" ) og_description=1;
				} else if ( dotName.substring(0,8) == "twitter:" ) {
					tout_twitter += tout;
				} else if ( dotName == "verify-v1" || dotName == "google-site-verification" || dotName == "360-site-verification" || dotName == "majestic-site-verification" || dotName == "sogou_site_verification" || dotName == "y_key" || dotName == "msvalidate.01" || dotName == "alexaverifyid" || dotName == "wot-verification" ) {
					tout_verification += tout;
				} else if ( dotName.substring(0,4) == "geo." || dotName == "icbm" ) {
					tout_geo += tout;
				} else if ( dotName == "keywords" || dotName == "description" || dotName == "robots" ) {
					tout_common += tout;
				} else {
					tout_other += tout;
				}
			}
			
		}
		
		
		if ( tout_opengraph != "" ) {
			out += "<div class='ad_seo_title'>OPEN GRAPH/FACEBOOK</div>";
			if ( og_title+og_type+og_url+og_image+og_description < 5 ) {
				out += "<div class='warning'><span>WARNING</span> ";
				if ( og_title == 0 ) out += " og:title ";
				if ( og_type == 0 ) out += " og:type ";
				if ( og_url == 0 ) out += " og:url ";
				if ( og_image == 0 ) out += " og:image ";
				if ( og_description == 0 ) out += " og:description ";
				out += " missing</div>";
				warnings ++;
			}
			out += tout_opengraph;
		}
		if ( tout_twitter != "" ) out += "<div class='ad_seo_title'>TWITTER</div>" + tout_twitter;

//SNIP
	

		if (debug) {
			console.log("* completed *");
		}

		sendResponse({
			farewell: "counted",
			out: out,
			warnings: warnings
		});
			
	}
		
		
});