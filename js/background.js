function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Add to EngCards";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info, tab) {
    
    var item = {
    				id: generateUUID(),
    				word: info.selectionText,
    				notes: ''
    			};

    chrome.storage.sync.get(function(data) { 
        if (data["engcards.words"]) {
         	var words = data["engcards.words"];
         	words.push(item);
         	chrome.storage.sync.set({"engcards.words": words});
        }

        if (window.Notification) { 
            var notification = new Notification('Added to EngCards', {
                icon: 'icon_48.png',
                body: item.word
            });

            setTimeout(function(){
                notification.close();
            },2000);
        }
    });
};