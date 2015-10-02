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