chrome.storage.sync.get(['zd_close_time'], function(result) {
    console.log('Value currently is ' + result.zd_close_time);
});

if (!localStorage.getItem("zd_close_time")) {
    document
        .getElementById('zd_close_time').value = 1;
    localStorage.zd_close_time = 1;
} else {
    document
        .getElementById('zd_close_time').value =
        localStorage.getItem("zd_close_time");
}

function updateIntervalTime()
{
    var input_value = document
        .getElementById('zd_close_time').value;

    var new_value = input_value ? input_value : 1;

    localStorage.zd_close_time = new_value;

    document.getElementById('stored_zd_close_time')
        .innerHTML = localStorage.getItem("zd_close_time");
    
    chrome.storage.sync.set({zd_close_time: new_value, naoexiste: new_value}, function() {
        console.log('Value is set to ' + new_value);
    });
    
    chrome.storage.sync.get(['zd_close_time', 'naoexiste'], function(result) {
        console.log('2Value currently is ' + result.zd_close_time);
        console.log('Value to naoexiste is ' + result.naoexiste);
    });
}

updateIntervalTime();

// function save_options() {
//     var input_value = document.getElementById('zd_close_time').value;
    
//     chrome.storage.sync.set({
//         zd_close_time: input_value
//     }, function() {
//         // Update status to let user know options were saved.
//         var status = document.getElementById('status');
//         status.textContent = 'Options saved.';
//         setTimeout(function() {
//             status.textContent = '';
//         }, 750);
//     });
// }


// function restore_options()
// {
//     chrome.storage.sync.get({
//         zd_close_time: 1
//     }, function(items) {
//         document.getElementById('input_value').value = items.zd_close_time;
//     });
// }
// document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('save').addEventListener('click',
    updateIntervalTime);