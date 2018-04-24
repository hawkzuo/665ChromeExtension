"use strict";

console.log("Extension loading...");
//const jQuery = require("jquery");
//const $ = jQuery;

const spamKiller = {

  // mutation observer
  observer: null,

  // init: add message listeners and call the appropriate function based on the request
  init: function () {
    // initialize a mutation observer (listens for changes to the DOM)
    MutationObserver = window.WebKitMutationObserver;
    this.observer = new MutationObserver(spamKiller.domChanged);

    // run the script on page init
    spamKiller.initPage();
      
  },

  // domChanged: the function to call when the DOM changes.
  domChanged: function (mutations, observer) {
    // console.log(mutations)
    for (let mut in mutations) {
      const mutation = mutations[mut];
      if (mutation.addedNodes.length > 0) {
        for (let i in mutation.addedNodes) {
          const node = mutation.addedNodes[i];
          if (node && node.nodeType === 1) {
            // TODO: Note the Syntax Here
            Array.from(node.getElementsByTagName("ytd-comment-renderer")).forEach(function (element) {
              let commentArea = element.getElementsByClassName('ytd-expander')[0];
              $.ajax({
                method: "GET",
                url: "http://localhost:8000/spam/json_request_youtube",
                data: {emailContent: commentArea.children[1].innerText},
                success: function (data_back) {                               // Show content
                  if (data_back['status'] === 'Failed') {
                    console.log('Failed')
                  } else if (data_back['status'] === 'spam') {
                    const oldComment = commentArea.children[1].innerText;
                    commentArea.innerHTML = `<div><button id="${oldComment}" class="show">Show anyway</button></div>`;
                    // console.log('spam');
                    console.log(`Hided Comment: ${oldComment}`);
                    $('.show').click(function (e) {
                      console.log(e.target);
                      if (e.target.id === oldComment) {
                        commentArea.innerHTML = (`<div><h1 class="label">${oldComment}</div>`)
                      }
                    });
                  } else {
                    commentArea.children[1].innerText = commentArea.children[1].innerText + '👋';
                    // console.log('ham');
                  }
                },
                error: function () {                                     // Show error msg
                  console.log('Error')
                }
              });
            });
          }
        }
      }
    }
  },

  // initIfLoaded: see if the page is fully loaded yet, and if so then call init.
  // Otherwise, try again in some time, until n attempts have been made
  initIfLoaded: function (time, n) {
    if (n < 0) {
      return;
    }

    setTimeout(function () {
        if (document.getElementById("content")) {
          spamKiller.initPage();
        } else {
          spamKiller.initIfLoaded(time, n - 1);
        }
      },
      time);
  },

  // initPage: initialize the DOM observer and spamKiller all comments during page load
  initPage: function () {
    this.observer.observe(document.getElementById("content"), {
      subtree: true,
      childList: true,
      attributes: false
    });

    // var x = document.getElementsByClassName("ytd-comment-renderer");
    //
    // for(var i=0; i<x.length; i++){
    //  console.log(x[i])
    // }
    Array.from(document.getElementsByTagName("ytd-comment-renderer")).forEach(function (element) {
      let commentArea = element.getElementsByClassName('ytd-expander')[0];
      $.ajax({
        method: "GET",
        url: "http://localhost:8000/spam/json_request_youtube",
        data: {emailContent: commentArea.children[1].innerText},
        success: function (data_back) {                               // Show content
          if (data_back['status'] === 'Failed') {
            console.log('Failed')
          } else if (data_back['status'] === 'spam') {
            const oldComment = commentArea.children[1].innerText;
            commentArea.innerHTML = `<div><button id="${oldComment}" class="show">Show anyway</button></div>`;
            // console.log('spam');
            console.log(`Hided Comment: ${oldComment}`);
            $('.show').click(function (e) {
              console.log(e.target);
              if (e.target.id === oldComment) {
                commentArea.innerHTML = (`<div><h1 class="label">${oldComment}</div>`)
              }
            });
          } else {
            commentArea.children[1].innerText = commentArea.children[1].innerText + '👋';
            // console.log('ham');

          }
        },
        error: function () {                                     // Show error msg
          console.log('Error')
        }
      });
    });

  },

};

chrome.storage.sync.get({
    permission : 'no_all'
}, function(items) {
    var cur_permission = items.permission;
    //alert(cur_permission);
    if (cur_permission=='no_all'){
        //do not perform spamKiller.init()
        //alert('888');
        chrome.runtime.sendMessage({
          action:'updateIcon',
          value:false
        }); 
    }
    else if(cur_permission=='yes_this'){
        chrome.runtime.sendMessage({
           action:'updateIcon',
           value:true
        });
        spamKiller.init();
        chrome.storage.sync.set({
            permission: 'no_all'
        });
    }
    else{
        //alert(cur_permission);
        chrome.runtime.sendMessage({
           action:'updateIcon',
           value:true
        });
        spamKiller.init();
    }
});
 


//spamKiller.init();
