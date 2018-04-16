//reference 1 - how to change Facebook content: https://github.com/daattali/smileyfy-my-facebook-extension
//reference 2 - how to access Facebook comments: https://doofenshmirtzevilincorporated.blogspot.com/2016/05/facebook-draw.html
//var xhr=[];
//var counter = 0;

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
			var x = document.getElementsByClassName("UFIComment");
			for(j=0; j<x.length; j++){
			(function(j) {
				textbody = x[j].getElementsByClassName("UFICommentBody");
				//console.log(textbody[0].innerHTML);
				xhr = new XMLHttpRequest();
				data = textbody[0].innerHTML.toString();
				xhr.open("GET", "http://localhost:8000/spam/json_request?emailContent=" + data, true);
				xhr.onreadystatechange = function() {
 		 			if (this.readyState == 4 && this.status == 200) {
						if(this.responseText.includes('ham')){
							if(document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.indexOf('👋')==-1){
     								document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML += '👋';
							}
						}
						else if(this.responseText.includes('spam')){
							if(!document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.includes('Show anyway') && !document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.includes('💀')){
                                    const olddata = document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.toString();
             alert(olddata);
     								document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML = `<div><button id="${olddata}" class="show">Show anyway</button></div>`;
                                    $('.show').click(function (e) {
                                                     if (e.target.id === olddata) {
                                                     document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML = olddata + '💀';
                                                     }
                                    });
							}
						}
						//if(document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.indexOf("status")==-1){
     						//	document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML += this.responseText;
						//}
   					}
 				};
  				xhr.send();
				//textbody[0].innerHTML = "yayaya" + textbody[0].innerHTML;
			})(j);
			}
			//counter += j;
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
	
	var xhr = [];
	for(j=0; j<x.length; j++){
		(function(j) {
		textbody = x[j].getElementsByClassName("UFICommentBody");
		//console.log(textbody[0].innerHTML);
		xhr = new XMLHttpRequest();
		data = textbody[0].innerHTML.toString();
		xhr.onreadystatechange = function() {
 		 	if (this.readyState == 4 && this.status == 200) {
				if(this.responseText.includes('ham')){
					if(document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.indexOf('👋')==-1){
     						document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML += '👋';
					}
				}
				else if(this.responseText.includes('spam')){
					if(!document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.includes('Show anyway') && !document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.includes('💀')){
                            const olddata = document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.toString();
         alert(olddata);
     						document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML = `<div><button id="${olddata}" class="show">Show anyway</button></div>`;
                            $('.show').click(function (e) {
                                             if (e.target.id === olddata) {
                                                             document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML = olddata + '💀';
                                             }
                                             
                            });
					}
				}
				//if(document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML.indexOf("status")==-1){
     				//	document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML += this.responseText;
				//}
   			}
 		};
		xhr.open("GET", "http://localhost:8000/spam/json_request?emailContent=" + data, true);
  		xhr.send();
		//textbody[0].innerHTML = "yayaya" + textbody[0].innerHTML;
		})(j);
	}
	//counter += j;

    
    },
    
};

spamfy.init();
