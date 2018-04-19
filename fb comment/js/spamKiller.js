//reference 1 - how to change Facebook content: https://github.com/daattali/smileyfy-my-facebook-extension
//reference 2 - how to access Facebook comments: https://doofenshmirtzevilincorporated.blogspot.com/2016/05/facebook-draw.html
//var xhr=[];
//var counter = 0;

var spamKiller = {
    
    // mutation observer
    observer : null,

    // init: add message listeners and call the appropriate function based on the request
    init : function() {
        
        
        
        // initialize a mutation observer (listens for changes to the DOM)
        MutationObserver = window.WebKitMutationObserver
        observer = new MutationObserver(spamKiller.domChanged);
                
        // run the script on page init
        spamKiller.initPage();                    

        // listen for messages and dispatch accordingly
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.action == "init") {
                                             alert('init!!!!');
                    spamKiller.initIfLoaded(2000, 10);
                }
                if (request.action == "refresh") {
                    spamKiller.initPage();
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
				var xhr = new XMLHttpRequest();
				data = textbody[0].innerHTML.toString();
				xhr.onreadystatechange = function() {
 		 			if (this.readyState == 4 && this.status == 200) {
						if(this.responseText.includes('ham')){
                            let commentArea = document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody");
							if(!commentArea[0].innerHTML.includes('👋') && !commentArea[0].innerHTML.includes('Show anyway')&& !commentArea[0].innerHTML.includes('💀')){
     								document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML += '👋';
							}
						}
						else if(this.responseText.includes('spam')){
                            let commentArea = document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody");
							if(!commentArea[0].innerHTML.includes('Show anyway') && !commentArea[0].innerHTML.includes('💀')){
                                    const ooolddata = commentArea[0].innerHTML;
             const oolddata = ooolddata.replace(/amp;/g, "jjj");
                                    const olddata = oolddata.replace(/\"/g, "zzz");
             commentArea[0].innerHTML = `<div class="container"><button type="button" class="show" id="${olddata}">Show anyway</button></div>`;
                                    $('.show').click(function (e) {
                                                     if (e.target.id === olddata) {
                                                     commentArea[0].innerHTML = ooolddata + '💀';
                                                     }
                                    });
							}
						}
   					}
 				};
                xhr.open("GET", "http://localhost:8000/spam/json_request?emailContent=" + data, true);
  				xhr.send();
			})(j);
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
            if (document.getElementById("content_container")) {
                spamKiller.initPage();
            } else {
                spamKiller.initIfLoaded(time, n-1);
            }},
            time);
    },
    
    // initPage: initialize the DOM observer and spamKiller all comments during page load
    initPage : function() {
        observer.observe(document.getElementById("content_container"), {
            subtree: true,
            childList: true,
            attributes: false
        });    
	var x = document.getElementsByClassName("UFIComment");
	
    
	for(j=0; j<x.length; j++){
		(function(j) {
		textbody = x[j].getElementsByClassName("UFICommentBody");
		//console.log(textbody[0].innerHTML);
		var xhr = new XMLHttpRequest();
		data = textbody[0].innerHTML.toString();
		xhr.onreadystatechange = function() {
 		 	if (this.readyState == 4 && this.status == 200) {
				if(this.responseText.includes('ham')){
                    let commentArea = document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody");
					if(!commentArea[0].innerHTML.includes('👋') && !commentArea[0].innerHTML.includes('Show anyway') && !commentArea[0].innerHTML.includes('💀')){
     						document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody")[0].innerHTML += '👋';
					}
				}
				else if(this.responseText.includes('spam')){
                    let commentArea = document.getElementsByClassName("UFIComment")[j].getElementsByClassName("UFICommentBody");
					if(!commentArea[0].innerHTML.includes('Show anyway') && !commentArea[0].innerHTML.includes('💀')){
                            const ooolddata = commentArea[0].innerHTML;
         const oolddata = ooolddata.replace(/amp;/g, "jjj");
                            const olddata = oolddata.replace(/\"/g, "zzz");
     						commentArea[0].innerHTML = `<div class="container"><button type="button" class="show" id="${olddata}">Show anyway</button></div>`;
                            $('.show').click(function (e) {
                                                    
                                             if (e.target.id === olddata) {
                                                             commentArea[0].innerHTML = ooolddata + '💀';
                                             }
                                             
                            });
					}
				}
   			}
 		};
		xhr.open("GET", "http://localhost:8000/spam/json_request?emailContent=" + data, true);
  		xhr.send();
		})(j);
	}
    

    
    },
    
};
         console.log('PogChamp');
         
chrome.storage.sync.get({
    permission : 'no_all'
}, function(items) {
    var cur_permission = items.permission;
    //alert(cur_permission);
    if (cur_permission=='no_all'){
        //do not perform spamKiller.init()
        //alert('888');
    }
    else if(cur_permission=='yes_this'){
        spamKiller.init();
        chrome.storage.sync.set({
            permission: 'no_all'
        })
    }
    else{
        //alert(cur_permission);
        spamKiller.init();
    }
});
//spamKiller.init();
