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

    gmail.observe.on("view_thread", (e) => {
        // The goal is to send a request with the gmail content
        // The request will send to localhost to generate a result 
        // indicating the email to be spam or not
        // Moreover, either the server or this script will highlight the 
        // "suspicious" words in this email to alert users

        const currentMail = gmail.dom.email($('div.adn'));
        const mailBody = currentMail.body();

        // An XHR request will be sent to server to verify the mailBody to be spam or not
        // On callback, update the UI to show the highlights
        currentMail.body('<h1>This is not a SPAM !</h1>' + mailBody);

        console.log(mailBody);

        var local_data = {};
        local_data["type"] ='tags';

        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", "http://localhost:3000/static_pages/total_size");
        oReq.send();



    });


});
