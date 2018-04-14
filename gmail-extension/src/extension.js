"use strict";

console.log("Extension loading...");
const jQuery = require("jquery");
const $ = jQuery;
const GmailFactory = require("gmail-js");
const gmail = new GmailFactory.Gmail($);
window.gmail = gmail;

function reqListener () {
    console.log(this.responseText);
}


gmail.observe.on("load", () => {
    const userEmail = gmail.get.user_email();
    console.log("Hello, " + userEmail + ". This is your extension talking!");

    gmail.observe.on("view_thread", (obj) => {
    // gmail.observe.after("open_email", (id, url, body, xhr) => {
        // The goal is to send a request with the gmail content
        // The request will send to localhost to generate a result
        // indicating the email to be spam or not
        // Moreover, either the server or this script will highlight the
        // "suspicious" words in this email to alert users

        console.log(obj);

    });

    // This event will only be triggered after the "view_thread" event already fired
    gmail.observe.on('view_email', function(obj) {
        console.log('view_email', obj);

        let currentMail = gmail.dom.email(obj.id);
        const mailBody = currentMail.body();
        const emailContent = currentMail.id_element.text();

        $.ajax({
          method: "GET",
          url: "http://localhost:8000/spam/json_request",
          data: { emailContent: emailContent },
          success: function(data_back) {                               // Show content
            if (data_back['status'] === 'Failed') {
              currentMail.body('<h1>Server cannot classify example !</h1>' + mailBody);
            } else if (data_back['status'] === 'spam'){
              currentMail.body('<div><h1 class="label">Potential Spam!</h1>' +
                  '<button id="showAnyway" class="show">Show anyway</button></div>' );

              $('#showAnyway').click(function (e) {
                console.log(e.target);
                currentMail.body('<div><h1 class="label">Potential Spam!</div>' + mailBody)
              });
            } else {
              // Ham
              // Call Word List API
              // Comment is short, loop over comment words, excahnge
              // Independent to comments
              currentMail.body('<h1 class="label">Not Spam!</h1>' + mailBody);

              // Keep making AJAX calls
              $.getJSON( "http://localhost:8000/spam/words", function( data ) {
                // var items = [];
                // $.each( data, function( key, val ) {
                //   items.push( "<li id='" + key + "'>" + val + "</li>" );
                // });
                //
                // $( "<ul/>", {
                //   "class": "my-new-list",
                //   html: items.join( "" )
                // }).appendTo( "body" );
                // console.log(data)
              });


            }
            console.log(currentMail);
          },
          error: function() {                                     // Show error msg
              currentMail.body('<h1>Server refused to connect !</h1>' + mailBody);
          }
        });


    });



});
