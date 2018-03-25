//reference 1 - how to change Facebook content: https://github.com/daattali/smileyfy-my-facebook-extension
//reference 2 - how to access Facebook comments: https://doofenshmirtzevilincorporated.blogspot.com/2016/05/facebook-draw.html

var spamfy = {
    
    // mutation observer
    observer : null,

    // init: add message listeners and call the appropriate function based on the request
    init : function() {
        // initialize a mutation observer (listens for changes to the DOM)
        MutationObserver = window.WebKitMutationObserver
        observer = new MutationObserver(spamfy.domChanged);
                
        // run the script on page init
        spamfy.initPage();                    

        // listen for messages and dispatch accordingly
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.action == "init") {
                    spamfy.initIfLoaded(2000, 1);
                }
                if (request.action == "refresh") {
                    spamfy.initPage();
                }
            }
        );
    },
    
    // domChanged: the function to call when the DOM changes.
    domChanged : function(mutations, observer) {
        for(var mut in mutations) {
            var mutation = mutations[mut];
            if (mutation.addedNodes.length > 0) {
                for (var i in mutation.addedNodes) {
                    var node = mutation.addedNodes[i];
                    if (node && node.nodeType == 1) {
			var x = node.getElementsByClassName("UFIComment");
			for(i=0; i<x.length; i++){
				textbody = x[i].getElementsByClassName("UFICommentBody");
				if(textbody[0].innerHTML.indexOf("GGGG This is a SPAM !")==-1){
					textbody[0].innerHTML = '<h1>GGGG This is a SPAM !</h1>' + textbody[0].innerHTML;
				}
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
            if (document.getElementById("contentArea")) {
                spamfy.initPage();
            } else {
                spamfy.initIfLoaded(time, n-1);
            }},
            time);
    },
    
    // initPage: initialize the DOM observer and spamfy all comments during page load
    initPage : function() {
        observer.observe(document.getElementById("contentArea"), {
            subtree: true,
            childList: true,
            attributes: false
        });    

	var x = document.getElementsByClassName("UFIComment");
	
	for(i=0; i<x.length; i++){
		textbody = x[i].getElementsByClassName("UFICommentBody");
		if(textbody[0].innerHTML.indexOf("GGGG This is a SPAM !")==-1){
			textbody[0].innerHTML = '<h1>GGGG This is a SPAM !</h1>' + textbody[0].innerHTML;
		}
		
	}

    
    },
    
};

spamfy.init();
