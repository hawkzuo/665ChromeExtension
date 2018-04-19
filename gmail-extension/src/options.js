// reference : https://developer.chrome.com/extensions/optionsV2
// reference 2 : https://stackoverflow.com/questions/18699075/callback-returns-undefined-with-chrome-storage-sync-get/18699147

//if (typeof localStorage === "undefined" || localStorage === null) {
//    var LocalStorage = require('node-localstorage').LocalStorage;
//    localStorage = new LocalStorage('./scratch');
//}

function save_options() {
    var select = document.getElementById("permission");
    var permission = select.children[select.selectedIndex].value;
    chrome.storage.sync.set({
        permission: permission
    }, function() {
       // Update status to let user know options were saved.
       var status = document.getElementById('status');
       status.textContent = 'Options saved.';
       setTimeout(function() {
          status.textContent = '';
       }, 750);
    });
    
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value permission = 'no_all'
    chrome.storage.sync.get({
        permission : 'no_all'
    }, function(items) {
                            console.log(items.permission);
        document.getElementById('permission').value = items.permission;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

