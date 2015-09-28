function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

document.addEventListener('DOMContentLoaded', function() {
    
});

//Helper
doGetRequest = function(url, callback, errback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if(callback)
                callback(xhr);
        }
        else if(xhr.readyState == 4 && xhr.status == 403) {
            if(errback)
                errback(xhr);
        }
    }
    xhr.send(null);
}
