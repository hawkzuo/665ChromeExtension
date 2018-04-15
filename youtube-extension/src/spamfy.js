"use strict";

console.log("Extension loading...");
const jQuery = require("jquery");
const $ = jQuery;



var spamfy = {

    // mutation observer
    observer : null,

    // init: add message listeners and call the appropriate function based on the request
    init : function() {
        // initialize a mutation observer (listens for changes to the DOM)
        MutationObserver = window.WebKitMutationObserver
        this.observer = new MutationObserver(spamfy.domChanged);

        // run the script on page init
        spamfy.initPage();

        // listen for messages and dispatch accordingly
        // chrome.runtime.onMessage.addListener(
        //     function(request, sender, sendResponse) {
        //         if (request.action == "init") {
        //             spamfy.initIfLoaded(2000, 1);
        //         }
        //         if (request.action == "refresh") {
        //             spamfy.initPage();
        //         }
        //     }
        // );
    },

    // domChanged: the function to call when the DOM changes.
    domChanged : function(mutations, observer) {
      // console.log(mutations)
        for(var mut in mutations) {
            var mutation = mutations[mut];
            if (mutation.addedNodes.length > 0) {
                for (var i in mutation.addedNodes) {
                    var node = mutation.addedNodes[i];
                    if (node && node.nodeType == 1) {
                			var x = node.getElementsByTagName("ytd-comment-renderer");
                			for(i=0; i<x.length; i++){

                        var target = x[i].getElementsByClassName('ytd-expander')[0];
                        console.log(x[i])
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
 		 		if (this.readyState == 4 && this.status == 200) {
     				 	//textbody[0].innerHTML = this.responseText;
					target.children[1].innerText = target.children[1].innerText + this.responseText;
   				}
 			};
			data = target.children[1].innerText.toString();
			xhttp.open("GET", "http://localhost:8000/spam/json_request?emailContent=" + data, true);
  			xhttp.send();
                        //target.children[1].innerText = target.children[1].innerText + '      ***SPAM***';
                        // target.innerHTML = target.innerHTML + '<h1>GGGG This is a SPAM !</h1>';
                			}
                    }
                }
            }
        }
    },

    // initIfLoaded: see if the page is fully loaded yet, and if so then call init.
    // Otherwise, try again in some time, until n attempts have been made
    initIfLoaded : function(time, n) {
        if (n < 0) {
            return;
        }

        setTimeout(function() {
            if (document.getElementById("content")) {
                spamfy.initPage();
            } else {
                spamfy.initIfLoaded(time, n-1);
            }},
            time);
    },

    // initPage: initialize the DOM observer and spamfy all comments during page load
    initPage : function() {
        this.observer.observe(document.getElementById("content"), {
            subtree: true,
            childList: true,
            attributes: false
        });

      	var x = document.getElementsByClassName("ytd-comment-renderer");

      	for(var i=0; i<x.length; i++){
      		// textbody = x[i].getElementsByClassName("UFICommentBody");
      		// console.log(textbody);
      		// if(textbody[0].innerHTML.indexOf("GGGG This is a SPAM !")==-1){
      		// 	textbody[0].innerHTML = '<h1>GGGG This is a SPAM !</h1>' + textbody[0].innerHTML;
      		// }
          console.log(x[i])
      	}
    },

};

spamfy.init();
