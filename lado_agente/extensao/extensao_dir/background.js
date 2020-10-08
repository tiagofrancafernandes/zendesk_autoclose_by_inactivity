window.default_zd_close_time = 1;

console.log("Unloading.");

chrome.runtime.onInstalled.addListener(function() {
    // window.open('https://www.linkedin.com/in/tiago-fran%C3%A7a/');
    window.open('https://tiagofranca.com/');

    chrome.storage.sync.get(['zd_close_time'], function(result) {

        console.log('Value zd_close_time is ' + result.zd_close_time);

        if(!result.zd_close_time)
        {
            console.log('zd_close_time nao existe em "chrome.storage.sync", criando');
            chrome.storage.sync.set({zd_close_time: window.default_zd_close_time}, function() {
                //
            });

            localStorage.zd_close_time = window.default_zd_close_time;
        }else{
            localStorage.zd_close_time = result.zd_close_time;
        }
    });
});